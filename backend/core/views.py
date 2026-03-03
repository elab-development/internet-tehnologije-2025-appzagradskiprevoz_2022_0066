from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from math import radians, sin, cos, sqrt, atan2
from collections import defaultdict
import heapq

from .models import Station, LineStop, Line

def health(request):
    return JsonResponse({"status": "ok"})

@api_view(["GET"])
def api_root(request):
    return Response({
        "health": reverse("health", request=request),
        "lines": reverse("line-list", request=request),
        "stations": reverse("station-list", request=request),
        "auth": {
            "register": reverse("register", request=request),
            "login": reverse("login", request=request),
            "logout": reverse("logout", request=request),
        }
    })

# --------- ROUTE PLANNING (FINAL) ---------

def haversine_m(lat1, lon1, lat2, lon2):
    R = 6371000.0
    p1, p2 = radians(lat1), radians(lat2)
    dphi = radians(lat2 - lat1)
    dl = radians(lon2 - lon1)
    a = sin(dphi/2)**2 + cos(p1)*cos(p2)*sin(dl/2)**2
    return 2*R*atan2(sqrt(a), sqrt(1-a))

def nearest_station(lat, lon):
    best, best_d = None, 1e18
    for s in Station.objects.all():
        d = haversine_m(lat, lon, s.latitude, s.longitude)
        if d < best_d:
            best_d = d
            best = s
    return best, best_d

def build_line_sequences():
    """
    Returns:
      line_seq[line_id] = [station_id_0, station_id_1, ...] ordered by LineStop.order
      station_lines[station_id] = set(line_ids that pass through station)
      pos_in_line[(line_id, station_id)] = index in sequence
    """
    line_seq = {}
    station_lines = defaultdict(set)
    pos_in_line = {}

    for line in Line.objects.all():
        stops = list(
            LineStop.objects.filter(line=line)
            .select_related("station")
            .order_by("order")
        )
        seq = [ls.station.id for ls in stops]
        line_seq[line.id] = seq
        for idx, sid in enumerate(seq):
            station_lines[sid].add(line.id)
            pos_in_line[(line.id, sid)] = idx

    return line_seq, station_lines, pos_in_line

def dijkstra_on_state_graph(start_sid, end_sid, line_seq, station_lines, pos_in_line):
    """
    State: (station_id, line_id) -> you are at station_id riding line_id.
    Moves:
      - along same line to neighbors: cost 1 (one stop)
      - transfer at same station to another line: cost TRANSFER_PENALTY
    Objective: minimize (#transfers first, then #stops) via penalty trick.
    """
    TRANSFER_PENALTY = 1000  # large so transfers are minimized first
    INF = 10**18

    # initial frontier: from start station, you may board any line that passes through it
    start_lines = list(station_lines.get(start_sid, []))
    end_lines = set(station_lines.get(end_sid, []))

    if not start_lines or not end_lines:
        return None

    dist = defaultdict(lambda: INF)
    parent = {}  # state -> previous_state
    parent_action = {}  # state -> ("move"/"transfer", meta)

    pq = []
    for lid in start_lines:
        s = (start_sid, lid)
        dist[s] = 0
        parent[s] = None
        parent_action[s] = None
        heapq.heappush(pq, (0, s))

    best_end_state = None
    best_end_cost = INF

    while pq:
        cost, state = heapq.heappop(pq)
        if cost != dist[state]:
            continue

        sid, lid = state

        # reached destination station (on any line)
        if sid == end_sid:
            if cost < best_end_cost:
                best_end_cost = cost
                best_end_state = state
            # we can continue but Dijkstra guarantees first time minimal
            break

        # 1) move along same line
        seq = line_seq.get(lid, [])
        idx = pos_in_line.get((lid, sid), None)
        if idx is not None:
            for nidx in (idx - 1, idx + 1):
                if 0 <= nidx < len(seq):
                    nsid = seq[nidx]
                    nstate = (nsid, lid)
                    ncost = cost + 1
                    if ncost < dist[nstate]:
                        dist[nstate] = ncost
                        parent[nstate] = state
                        parent_action[nstate] = ("move", None)
                        heapq.heappush(pq, (ncost, nstate))

        # 2) transfer to other lines at same station
        for nlid in station_lines.get(sid, []):
            if nlid == lid:
                continue
            nstate = (sid, nlid)
            ncost = cost + TRANSFER_PENALTY
            if ncost < dist[nstate]:
                dist[nstate] = ncost
                parent[nstate] = state
                parent_action[nstate] = ("transfer", {"from": lid, "to": nlid})
                heapq.heappush(pq, (ncost, nstate))

    if best_end_state is None:
        return None

    # reconstruct state path
    states = []
    cur = best_end_state
    while cur is not None:
        states.append(cur)
        cur = parent[cur]
    states.reverse()
    return states

def states_to_station_path_and_segments(states, line_seq, pos_in_line):
    """
    Convert state path [(sid,lid),...] into:
      - ordered station_id list without duplicates
      - segments with proper line + from/to station_ids (in the correct direction)
    """
    if not states:
        return [], []

    # station path (keep consecutive duplicates out)
    station_ids = []
    for sid, lid in states:
        if not station_ids or station_ids[-1] != sid:
            station_ids.append(sid)

    # segments: whenever line changes in states
    segments = []
    cur_line = states[0][1]
    seg_start_sid = states[0][0]

    for i in range(1, len(states)):
        sid, lid = states[i]
        prev_sid, prev_lid = states[i-1]
        if lid != cur_line:
            # close segment on previous line at prev_sid
            segments.append({
                "line_id": cur_line,
                "from_station_id": seg_start_sid,
                "to_station_id": prev_sid,
            })
            cur_line = lid
            seg_start_sid = prev_sid

    # close last segment
    segments.append({
        "line_id": cur_line,
        "from_station_id": seg_start_sid,
        "to_station_id": states[-1][0],
    })

    return station_ids, segments

@api_view(["GET"])
def plan_route(request):
    try:
        from_lat = float(request.query_params["from_lat"])
        from_lon = float(request.query_params["from_lon"])
        to_lat = float(request.query_params["to_lat"])
        to_lon = float(request.query_params["to_lon"])
    except Exception:
        return Response({"error": "Missing/invalid params"}, status=400)

    start_station, d1 = nearest_station(from_lat, from_lon)
    end_station, d2 = nearest_station(to_lat, to_lon)

    if not start_station or not end_station:
        return Response({"error": "No stations in DB"}, status=400)

    line_seq, station_lines, pos_in_line = build_line_sequences()

    states = dijkstra_on_state_graph(
        start_station.id, end_station.id,
        line_seq, station_lines, pos_in_line
    )

    if not states:
        return Response({
            "from_station": {"id": start_station.id, "name": start_station.name, "distance_m": round(d1)},
            "to_station": {"id": end_station.id, "name": end_station.name, "distance_m": round(d2)},
            "error": "No path in network"
        })

    station_ids, segments = states_to_station_path_and_segments(states, line_seq, pos_in_line)

    # enrich segments with line_name and station names
    stations = {s.id: s for s in Station.objects.filter(id__in=station_ids)}
    lines = {l.id: l for l in Line.objects.all()}

    path_stations = [
        {"id": sid, "name": stations[sid].name, "lat": stations[sid].latitude, "lon": stations[sid].longitude}
        for sid in station_ids
    ]

    segments_full = []
    for seg in segments:
        lid = seg["line_id"]
        a = seg["from_station_id"]
        b = seg["to_station_id"]
        segments_full.append({
            "line_id": lid,
            "line_name": lines[lid].name if lid in lines else str(lid),
            "from_station_id": a,
            "from_station_name": stations[a].name if a in stations else str(a),
            "to_station_id": b,
            "to_station_name": stations[b].name if b in stations else str(b),
        })

    return Response({
        "from_station": {"id": start_station.id, "name": start_station.name, "distance_m": round(d1)},
        "to_station": {"id": end_station.id, "name": end_station.name, "distance_m": round(d2)},
        "path_stations": path_stations,
        "segments": segments_full,
    })