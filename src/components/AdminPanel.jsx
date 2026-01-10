import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setError("Brak tokenu admina. Zaloguj się.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Użytkownicy
    axios
      .get("http://localhost:3000/api/admin/users", { headers })
      .then((res) => setUsers(res.data))
      .catch(() => setError("Błąd pobierania użytkowników."));

    // Aktywności
    axios
      .get("http://localhost:3000/api/admin/activities", { headers })
      .then((res) => setActivities(res.data))
      .catch(() => setError("Błąd pobierania aktywności."));

    // Statystyki
    axios
      .get("http://localhost:3000/api/admin/stats", { headers })
      .then((res) => setStats(res.data))
      .catch(() => setError("Błąd pobierania statystyk."));
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setError("Brak tokenu admina.");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3000/api/admin/activities/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setError("Nie udało się usunąć aktywności.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const filteredActivities = activities.filter((a) =>
    typeFilter ? a.type === typeFilter : true
  );

  return (
    <>
      <h2>Panel administratora</h2>

      {error && (
        <p style={{ color: "red" }}>
          {error}{" "}
          <Link to="/admin/login">(przejdź do logowania)</Link>
        </p>
      )}

      <button onClick={handleLogout} style={{ marginBottom: "15px" }}>
        Wyloguj admina
      </button>

      {/* Statystyki */}
      <section style={{ marginBottom: "20px" }}>
        <h3>Statystyki globalne</h3>
        {stats ? (
          <ul>
            <li>Liczba użytkowników: {stats.totalUsers}</li>
            <li>Liczba aktywności: {stats.totalActivities}</li>
            <li>Łączny dystans: {stats.totalDistance} km</li>
          </ul>
        ) : (
          <p>Ładowanie statystyk...</p>
        )}
      </section>

      {/* Użytkownicy */}
      <section style={{ marginBottom: "20px" }}>
        <h3>Użytkownicy</h3>
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID</th>
              <th>E-mail</th>
              <th>Rola</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Aktywności */}
      <section>
        <h3>Aktywności</h3>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Filtr typu:
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ marginLeft: "10px" }}
            >
              <option value="">(wszystkie)</option>
              <option value="run">Bieg</option>
              <option value="walk">Spacer</option>
            </select>
          </label>
        </div>

        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID użytkownika</th>
              <th>Nazwa</th>
              <th>Typ</th>
              <th>Dystans [km]</th>
              <th>Data</th>
              <th>Skąd</th>
              <th>Dokąd</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.user_id}</td>
                <td>{a.name}</td>
                <td>{a.type}</td>
                <td>{a.distance_km}</td>
                <td>{new Date(a.started_at).toLocaleString()}</td>
                <td>{a.start_place || "-"}</td>
                <td>{a.end_place || "-"}</td>
                <td>
                  <button onClick={() => handleDelete(a.id)}>
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
