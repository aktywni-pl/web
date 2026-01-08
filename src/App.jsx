import { Routes, Route, Link } from "react-router-dom";
import ActivitiesList from "./components/ActivitiesList.jsx";
import ActivityDetails from "./components/ActivityDetails.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminPanel from "./components/AdminPanel.jsx";

export default function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Aktywni.pl — Web</h1>

      <nav style={{ marginBottom: "10px", display: "flex", gap: "15px" }}>
        <Link to="/">Lista aktywności</Link>
        <Link to="/admin">Panel admina</Link>
        <Link to="/admin/login">Logowanie admina</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ActivitiesList />} />
        <Route path="/activity/:id" element={<ActivityDetails />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </div>
  );
}
