import { useMemo, useState } from "react";
import axios from "axios";
import { useLocation, Link, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const tokenFromUrl = query.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      const res = await axios.post("/api/password/reset", { token, newPassword });
      setInfo(res.data?.message || "Hasło zmienione.");
      setNewPassword("");
      setTimeout(() => navigate("/admin/login"), 900);
    } catch {
      setError("Nie udało się zmienić hasła (token wygasł lub nieprawidłowy).");
    }
  };

  return (
    <>
      <h2>Ustaw nowe hasło</h2>

      <form onSubmit={submit} style={{ maxWidth: 420 }}>
        <div style={{ marginBottom: 10 }}>
          <label>
            Token
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              style={{ width: "100%" }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Nowe hasło (min 6 znaków)
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: "100%" }}
              required
              minLength={6}
            />
          </label>
        </div>

        <button type="submit">Zmień hasło</button>

        {info && <p style={{ marginTop: 10, color: "green" }}>{info}</p>}
        {error && <p style={{ marginTop: 10, color: "red" }}>{error}</p>}

        <p style={{ marginTop: 12 }}>
          <Link to="/admin/login">Powrót do logowania</Link>
        </p>
      </form>
    </>
  );
}
