export async function geocode(query) {
  const q0 = query.trim();
  if (!q0) throw new Error("Prazan unos.");

  const q = /beograd|belgrade|serbia|srbija/i.test(q0) ? q0 : `${q0}, Beograd, Srbija`;

  const params = new URLSearchParams({
    format: "json",
    limit: "1",
    q,
    countrycodes: "rs",
    bounded: "1",
    viewbox: "20.18,44.95,20.65,44.65", 
  });

  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Geocoding servis nije dostupan.");

  const data = await res.json();
  if (!data?.length) throw new Error(`Ne mogu da nađem lokaciju: "${q0}"`);

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}