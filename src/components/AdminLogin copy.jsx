import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@aktywni.pl");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/login", {
        email,
        password
      });

      if (res.data.role !== "admin") {
        setError("Użytkownik nie ma roli administratora.");
        return;
      }

      localStorage.setItem("adminToken", res.data.token);

      navigate("/admin");
    } catch {
      setError("Nieprawidłowy login lub hasło.");
    }
  };

  return (
    <>
      <h2>Logowanie administratora</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "320px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Hasło
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
        </div>

        <button type="submit">Zaloguj</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </>
  );
}
