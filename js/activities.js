document.addEventListener("DOMContentLoaded", () => {
    // Pobieramy ID aktywności z URL, np. ?id=1
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    // Fikcyjne dane — docelowo będzie API
    const MOCK_DETAILS = {
        id: 1,
        name: "Bieg po parku",
        distance_km: 5.2,
        duration_min: 30,
        started_at: "2025-03-01T17:00:00Z",
        gps_points: [
            [51.0500, 17.0000],
            [51.0505, 17.0010],
            [51.0510, 17.0020],
            [51.0515, 17.0015],
            [51.0510, 17.0005]
        ]
    };

    // Wypełnienie informacji tekstowych
    const box = document.getElementById("activityInfo");
    box.innerHTML = `
        <strong>${MOCK_DETAILS.name}</strong><br>
        Dystans: ${MOCK_DETAILS.distance_km} km<br>
        Czas: ${MOCK_DETAILS.duration_min} min<br>
        Data: ${new Date(MOCK_DETAILS.started_at).toLocaleString()}
    `;

    // Tworzymy mapę Leaflet
    const map = L.map('map').setView(MOCK_DETAILS.gps_points[0], 15);

    // Dodajemy warstwę OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Rysujemy linię trasy
    const polyline = L.polyline(MOCK_DETAILS.gps_points, { color: 'red' }).addTo(map);

    // Dopasowujemy mapę do trasy
    map.fitBounds(polyline.getBounds());
});
