import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import L from "leaflet";

export default function ActivityDetails() {

  const { id } = useParams();
  const [activity, setActivity] = useState(null);

  useEffect(() => {

    axios.get(`http://localhost:3000/api/activities`)
      .then(res => {
        const found = res.data.find(a => a.id == id);
        setActivity(found);

        // Inicjalizacja mapy
        const map = L.map("map").setView([51.1, 17.0], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19
        }).addTo(map);
      });

  }, [id]);

  if (!activity) return <h2>Ładowanie...</h2>;

  return (
    <>
      <h2>Szczegóły aktywności</h2>

      <p><b>Nazwa:</b> {activity.name}</p>
      <p><b>Typ:</b> {activity.type}</p>
      <p><b>Dystans:</b> {activity.distance_km} km</p>

      <div
        id="map"
        style={{
          height: "400px",
          marginTop: "15px",
          border: "1px solid #333"
        }}
      />
    </>
  );
}
