import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@aktywni.pl");
  const [password, setPassword] = useState("admin123");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState("login"); // login | register
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        const res = await axios.post("/api/login", {
          email,
          password,
        });

        if (res.data.role !== "admin") {
          setError("Użytkownik nie ma roli administratora.");
          return;
        }

        localStorage.setItem("adminToken", res.data.token);
        navigate("/admin");
        return;
      }

      if (mode === "register") {
        // prosta walidacja po stronie frontu
        if (password.length < 8) {
          setError("Hasło musi mieć co najmniej 8 znaków.");
          return;
        }

        if (password !== confirmPassword) {
          setError("Hasła nie są takie same.");
          return;
        }

        await axios.post("/api/register", {
          email,
          password,
          confirmPassword,
        });

        setError("Rejestracja zakończona. Możesz się zalogować.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
        return;
      }
    } catch {
      setError("Błąd: nieprawidłowe dane lub konto już istnieje.");
    }
  };

  const toggleMode = () => {
    const nextMode = mode === "login" ? "register" : "login";
    setMode(nextMode);
    setError("");
    setPassword("");
    setConfirmPassword("");
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%" }}
              required
            />
          </label>
        </div>

        {mode === "register" && (
          <div style={{ marginBottom: "10px" }}>
            <label>
              Potwierdź hasło
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: "100%" }}
                required
              />
            </label>
          </div>
        )}

        <button type="submit">
          {mode === "login" ? "Zaloguj" : "Zarejestruj"}
        </button>

        <button
          type="button"
          onClick={toggleMode}
          style={{ marginLeft: "10px" }}
        >
          {mode === "login" ? "Rejestracja" : "Powrót"}
        </button>

        {error && (
          <p
            style={{
              marginTop: "10px",
              color: error.includes("zakończona") ? "green" : "red",
            }}
          >
            {error}
          </p>
        )}

        <p style={{ marginTop: "12px" }}>
          <Link to="/forgot-password">Nie pamiętasz hasła?</Link>
        </p>
      </form>
    </>
  );
}
