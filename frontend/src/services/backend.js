const API_BASE = "http://127.0.0.1:8000/api";

export async function fetchLineStops(lineId) {
  const res = await fetch(`${API_BASE}/lines/${lineId}/stops/`);
  if (!res.ok) throw new Error("Ne mogu da učitam stanice za liniju.");
  return res.json();
}

export async function planRoute(from, to, fromText = "", toText = "") {
  const url =
    `${API_BASE}/plan-route/` +
    `?from_lat=${from.lat}&from_lon=${from.lon}` +
    `&to_lat=${to.lat}&to_lon=${to.lon}` +
    `&from_text=${encodeURIComponent(fromText)}` +
    `&to_text=${encodeURIComponent(toText)}`;

  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    headers: token ? { Authorization: `Token ${token}` } : {},
  });

  if (!res.ok) throw new Error("Ne mogu da dobijem plan rute.");
  return res.json();
}

export async function createFavoriteRoute(payload) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/favorite-routes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Ne mogu da sačuvam omiljenu rutu.");
  return res.json();
}

export async function listFavoriteRoutes() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/favorite-routes/`, {
    headers: { Authorization: `Token ${token}` },
  });
  if (!res.ok) throw new Error("Ne mogu da učitam omiljene rute.");
  return res.json();
}

export async function deleteFavoriteRoute(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/favorite-routes/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Token ${token}` },
  });
  if (!res.ok) throw new Error("Ne mogu da obrišem omiljenu rutu.");
  return true;
}

export async function listRouteHistory() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/route-history/`, {
    headers: { Authorization: `Token ${token}` },
  });
  if (!res.ok) throw new Error("Ne mogu da učitam istoriju ruta.");
  return res.json();
}