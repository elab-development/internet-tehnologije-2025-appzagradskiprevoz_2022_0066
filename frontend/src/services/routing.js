export async function getRoute(from, to) {
  const url =
    "https://router.project-osrm.org/route/v1/driving/" +
    `${from.lon},${from.lat};${to.lon},${to.lat}` +
    "?overview=full&geometries=geojson&steps=false&continue_straight=true";

  const res = await fetch(url);
  if (!res.ok) throw new Error("Routing servis nije dostupan");

  const data = await res.json();
  const route = data?.routes?.[0];
  if (!route) throw new Error("Nema rute za zadate tačke.");

  return {
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    geojson: route.geometry,
  };
}

export async function getRouteThroughPoints(points) {
  if (!points || points.length < 2) throw new Error("Bar 2 tačke su potrebne.");

  const cleaned = [];
  const EPS = 0.00015; 
  for (const p of points) {
    if (!cleaned.length) cleaned.push(p);
    else {
      const prev = cleaned[cleaned.length - 1];
      if (Math.abs(p.lat - prev.lat) > EPS || Math.abs(p.lon - prev.lon) > EPS) cleaned.push(p);
    }
  }
  if (cleaned.length < 2) throw new Error("Premalo različitih tačaka za rutu.");

  const coords = cleaned.map((p) => `${p.lon},${p.lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false&continue_straight=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("OSRM nije dostupan");

  const data = await res.json();
  const route = data?.routes?.[0];
  if (!route) throw new Error("Nema rute za zadate tačke.");

  return {
    geojson: route.geometry,
    distanceMeters: route.distance,
    durationSeconds: route.duration,
  };
}