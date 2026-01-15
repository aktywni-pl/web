import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("admin@aktywni.pl");
  const [info, setInfo] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setToken("");

    try {
      const res = await axios.post("/api/password/forgot", { email });
      setInfo(res.data?.message || "OK");
      if (res.data?.token) setToken(res.data.token);
    } catch {
      setError("Błąd wysłania żądania resetu.");
    }
  };

  return (
    <>
      <h2>Reset hasła</h2>

      <form onSubmit={submit} style={{ maxWidth: 420 }}>
        <div style={{ marginBottom: 10 }}>
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

        <button type="submit">Wygeneruj token</button>

        {info && <p style={{ marginTop: 10, color: "green" }}>{info}</p>}
        {error && <p style={{ marginTop: 10, color: "red" }}>{error}</p>}

        {token && (
          <div style={{ marginTop: 12, padding: 12, border: "1px solid rgba(15,23,42,0.15)", borderRadius: 12 }}>
            <p style={{ margin: 0 }}>
              <b>Token (DEMO – bez maila):</b>
            </p>
            <code style={{ display: "block", marginTop: 8, wordBreak: "break-all" }}>{token}</code>

            <div style={{ marginTop: 10 }}>
              <Link to={`/reset-password?token=${token}`}>Ustaw nowe hasło</Link>
            </div>
          </div>
        )}
      </form>
    </>
  );
}
