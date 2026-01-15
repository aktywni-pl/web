import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@aktywni.pl");
  const [password, setPassword] = useState("admin123");
  const [mode, setMode] = useState("login"); // login | register
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        const res = await axios.post("http://localhost:3000/api/login", {
          email,
          password
        });

        if (res.data.role !== "admin") {
          setError("Użytkownik nie ma roli administratora.");
          return;
        }

        localStorage.setItem("adminToken", res.data.token);
        navigate("/admin");
      }

      if (mode === "register") {
        await axios.post("http://localhost:3000/api/register", {
          email,
          password
        });

        setError("Rejestracja zakończona. Możesz się zalogować.");
        setMode("login");
        setPassword("");
      }
    } catch {
      setError("Błąd: nieprawidłowe dane lub konto już istnieje.");
    }
  };

  return (
    <>
      <h2>
        {mode === "login"
          ? "Logowanie administratora"
          : "Rejestracja użytkownika"}
      </h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "320px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: "100%" }}
              required
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
              required
            />
          </label>
        </div>

        <button type="submit">
          {mode === "login" ? "Zaloguj" : "Zarejestruj"}
        </button>

        <button
          type="button"
          onClick={() =>
            setMode(mode === "login" ? "register" : "login")
          }
          style={{ marginLeft: "10px" }}
        >
          {mode === "login" ? "Rejestracja" : "Powrót"}
        </button>

        {error && (
          <p
            style={{
              marginTop: "10px",
              color: error.includes("zakończona") ? "green" : "red"
            }}
          >
            {error}
          </p>
        )}
      </form>
    </>
  );
}
