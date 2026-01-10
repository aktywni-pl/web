import { Routes, Route, Link } from "react-router-dom";
import ActivitiesList from "./components/ActivitiesList.jsx";
import ActivityDetails from "./components/ActivityDetails.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminPanel from "./components/AdminPanel.jsx";

export default function App() {
  return (
    <div>
      {/* Top bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#0b1220",
          color: "#fff",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>
            <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
              Aktywni.pl
            </Link>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/" style={navLinkStyle}>Lista aktywności</Link>
            <Link to="/admin" style={navLinkStyle}>Panel admina</Link>
            <Link to="/admin/login" style={navLinkStyle}>Logowanie</Link>
          </div>
        </div>
      </div>

      {/* Page container */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "18px 16px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid rgba(15,23,42,0.10)",
            boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
            padding: 16,
          }}
        >
          <Routes>
            <Route path="/" element={<ActivitiesList />} />
            <Route path="/activity/:id" element={<ActivityDetails />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>

        <div style={{ textAlign: "center", marginTop: 12, color: "rgba(15,23,42,0.65)", fontSize: 12 }}>
          Aktywni.pl — Web
        </div>
      </div>
    </div>
  );
}

const navLinkStyle = {
  color: "rgba(255,255,255,0.92)",
  textDecoration: "none",
  padding: "6px 10px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.14)",
};
