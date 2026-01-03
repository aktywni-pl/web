document.addEventListener("DOMContentLoaded", () => {
    // sprawdzenie "logowania"
    const token = localStorage.getItem("authToken");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // wylogowanie
    document.getElementById("logoutLink").addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("authToken");
        window.location.href = "login.html";
    });

    // na razie dane udawane
    const MOCK_ACTIVITIES = [
        {
            id: 1,
            name: "Bieg po parku",
            type: "run",
            distance_km: 5.2,
            duration_min: 30,
            started_at: "2025-03-01T17:00:00Z"
        },
        {
            id: 2,
            name: "Spacer z psem",
            type: "walk",
            distance_km: 2.3,
            duration_min: 25,
            started_at: "2025-03-02T18:15:00Z"
        }
    ];

    const tbody = document.getElementById("activitiesTableBody");
    tbody.innerHTML = "";

    MOCK_ACTIVITIES.forEach(act => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${act.name}</td>
            <td>${act.type}</td>
            <td>${act.distance_km}</td>
            <td>${act.duration_min}</td>
            <td>${new Date(act.started_at).toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
});
