import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function pickDateField(a) {
  return a?.created_at || a?.createdAt || a?.started_at || a?.startedAt;
}

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  // cache skąd/dokąd z tracka per activityId
  const [trackCache, setTrackCache] = useState({}); // { [id]: { startText, endText } }

  // Filtry
  const [typeFilter, setTypeFilter] = useState("");
  const [userFilter, setUserFilter] = useState(""); // user_id
  const [dateFrom, setDateFrom] = useState(""); // yyyy-mm-dd
  const [dateTo, setDateTo] = useState(""); // yyyy-mm-dd
  const [minDistance, setMinDistance] = useState(""); // km
  const [maxDistance, setMaxDistance] = useState(""); // km
  const [q, setQ] = useState(""); // search po nazwie/miejscach/id

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setError("Brak tokenu admina. Zaloguj się.");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get("/api/admin/users", { headers })
      .then((res) => setUsers(res.data))
      .catch(() => setError("Błąd pobierania użytkowników."));

    axios
      .get("/api/admin/activities", { headers })
      .then((res) => setActivities(res.data))
      .catch(() => setError("Błąd pobierania aktywności."));

    axios
      .get("/api/admin/stats", { headers })
      .then((res) => setStats(res.data))
      .catch(() => setError("Błąd pobierania statystyk."));
  }, []);

  // dociąganie tracka dla widocznych wierszy (po filtrach) i cache
  useEffect(() => {
    if (!filteredActivities.length) return;

    const token = localStorage.getItem("adminToken");
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    const missingIds = filteredActivities
      .map((a) => a.id)
      .filter((id) => trackCache[id] === undefined);

    if (!missingIds.length) return;

    missingIds.forEach((id) => {
      axios
        .get(`/api/activities/${id}/track`, { headers })
        .then((trackRes) => {
          const points = trackRes?.data?.points || [];
          if (!points.length) {
            setTrackCache((prev) => ({
              ...prev,
              [id]: { startText: "-", endText: "-" },
            }));
            return;
          }

          const start = points[0];
          const end = points[points.length - 1];

          const fmt = (p) =>
            `${Number(p.lat).toFixed(5)},${Number(p.lon).toFixed(5)}`;

          setTrackCache((prev) => ({
            ...prev,
            [id]: { startText: fmt(start), endText: fmt(end) },
          }));
        })
        .catch(() => {
          setTrackCache((prev) => ({
            ...prev,
            [id]: { startText: "-", endText: "-" },
          }));
        });
    });
  }, [activities, trackCache]); // <- UWAGA: filteredActivities jest niżej, więc efekt jest poniżej w kodzie (patrz niżej)

  const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setError("Brak tokenu admina.");
      return;
    }

    const ok = confirm(`Usunąć aktywność ID=${id}?`);
    if (!ok) return;

    try {
      await axios.delete(`/api/admin/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities((prev) => prev.filter((a) => a.id !== id));

      // usuń też z cache
      setTrackCache((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch {
      setError("Nie udało się usunąć aktywności.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const clearFilters = () => {
    setTypeFilter("");
    setUserFilter("");
    setDateFrom("");
    setDateTo("");
    setMinDistance("");
    setMaxDistance("");
    setQ("");
  };

  const filteredActivities = useMemo(() => {
    const qNorm = (q || "").trim().toLowerCase();

    const minD = minDistance === "" ? null : Number(minDistance);
    const maxD = maxDistance === "" ? null : Number(maxDistance);

    const fromMs =
      dateFrom && dateFrom.length === 10
        ? new Date(`${dateFrom}T00:00:00`).getTime()
        : null;
    const toMs =
      dateTo && dateTo.length === 10
        ? new Date(`${dateTo}T23:59:59`).getTime()
        : null;

    return activities.filter((a) => {
      if (typeFilter && a.type !== typeFilter) return false;
      if (userFilter && String(a.user_id) !== String(userFilter)) return false;

      const dist = Number(a.distance_km);
      if (minD !== null && !Number.isNaN(minD) && dist < minD) return false;
      if (maxD !== null && !Number.isNaN(maxD) && dist > maxD) return false;

      const df = pickDateField(a);
      if (fromMs !== null || toMs !== null) {
        const t = new Date(df).getTime();
        if (!Number.isNaN(t)) {
          if (fromMs !== null && t < fromMs) return false;
          if (toMs !== null && t > toMs) return false;
        }
      }

      if (qNorm) {
        const hay = [
          a.name,
          a.type,
          a.start_place,
          a.end_place,
          String(a.id),
          String(a.user_id),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!hay.includes(qNorm)) return false;
      }

      return true;
    });
  }, [
    activities,
    typeFilter,
    userFilter,
    dateFrom,
    dateTo,
    minDistance,
    maxDistance,
    q,
  ]);

  // poprawka: ten useEffect MUSI używać filteredActivities, więc dajemy go TU (po definicji)
  useEffect(() => {
    if (!filteredActivities.length) return;

    const token = localStorage.getItem("adminToken");
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    const missingIds = filteredActivities
      .map((a) => a.id)
      .filter((id) => trackCache[id] === undefined);

    if (!missingIds.length) return;

    missingIds.forEach((id) => {
      axios
        .get(`/api/activities/${id}/track`, { headers })
        .then((trackRes) => {
          const points = trackRes?.data?.points || [];
          if (!points.length) {
            setTrackCache((prev) => ({
              ...prev,
              [id]: { startText: "-", endText: "-" },
            }));
            return;
          }

          const start = points[0];
          const end = points[points.length - 1];

          const fmt = (p) =>
            `${Number(p.lat).toFixed(5)},${Number(p.lon).toFixed(5)}`;

          setTrackCache((prev) => ({
            ...prev,
            [id]: { startText: fmt(start), endText: fmt(end) },
          }));
        })
        .catch(() => {
          setTrackCache((prev) => ({
            ...prev,
            [id]: { startText: "-", endText: "-" },
          }));
        });
    });
  }, [filteredActivities, trackCache]);

  return (
    <>
      <h2>Panel administratora</h2>

      {error && (
        <p style={{ color: "red" }}>
          {error} <Link to="/admin/login">(przejdź do logowania)</Link>
        </p>
      )}

      <button onClick={handleLogout} style={{ marginBottom: "15px" }}>
        Wyloguj admina
      </button>

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

      <section style={{ marginBottom: "20px" }}>
        <h3>Użytkownicy</h3>

        <div className="tableWrap">
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
        </div>
      </section>

      <section>
        <h3>Aktywności</h3>

        <div className="filtersGrid" style={{ marginBottom: 12 }}>
          <div>
            <label>
              Szukaj (nazwa / id)
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="np. wieczorny, 12..."
              />
            </label>
          </div>

          <div>
            <label>
              Typ
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">(wszystkie)</option>
                <option value="run">Bieg</option>
                <option value="walk">Spacer</option>
                <option value="bike">Rower</option>
              </select>
            </label>
          </div>

          <div>
            <label>
              Użytkownik
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              >
                <option value="">(wszyscy)</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.id} — {u.email}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Dystans min (km)
              <input
                type="number"
                step="0.1"
                value={minDistance}
                onChange={(e) => setMinDistance(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label>
              Dystans max (km)
              <input
                type="number"
                step="0.1"
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label>
              Data od
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label>
              Data do
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "end" }}>
            <button type="button" onClick={clearFilters}>
              Wyczyść
            </button>
            <div style={{ marginLeft: "auto", fontSize: 12, opacity: 0.75 }}>
              Wynik: {filteredActivities.length} / {activities.length}
            </div>
          </div>
        </div>

        <div className="tableWrap">
          <table border="1" cellPadding="6" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>ID użytkownika</th>
                <th>Nazwa</th>
                <th>Typ</th>
                <th>Dystans [km]</th>
                <th>Data</th>
                <th className="col-hide-mobile">Skąd</th>
                <th className="col-hide-mobile">Dokąd</th>
                <th>Akcje</th>
              </tr>
            </thead>

            <tbody>
              {filteredActivities.map((a) => {
                const df = pickDateField(a);
                const prettyDate = df ? new Date(df).toLocaleString() : "-";

                const cached = trackCache[a.id];
                const fromTxt = cached?.startText ?? a.start_place ?? "-";
                const toTxt = cached?.endText ?? a.end_place ?? "-";

                return (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.user_id}</td>
                    <td>{a.name}</td>
                    <td>{a.type}</td>
                    <td>{a.distance_km}</td>
                    <td>{prettyDate}</td>
                    <td className="col-hide-mobile">{fromTxt}</td>
                    <td className="col-hide-mobile">{toTxt}</td>
                    <td>
                      <button onClick={() => handleDelete(a.id)}>Usuń</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
