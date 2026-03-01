export async function getRoute(from, to) {
    const url = "https://router.project-osrm.org/route/v1/driving/" +
        `${from.lon},${from.lat};${to.lon},${to.lat}` +
        "?overview=full&geometries=geojson";

    const res = await fetch(url);
    if (!res.ok) throw new Error("Routing servis nije dostupan");

    const data = await res.json();
    const route = data?.routes?.[0];
    if(!route) throw new Error("Nema rute za zadate tacke.");

    return{
        distanceMeters: route.distance,
        durationSeconds: route.duration,
        geojson: route.geometry
    }
}