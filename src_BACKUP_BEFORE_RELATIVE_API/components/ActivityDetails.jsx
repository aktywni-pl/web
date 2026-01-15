import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import L from "leaflet";

export default function ActivityDetails() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [trackInfo, setTrackInfo] = useState(null); // start/meta z tracka
  const mapRef = useRef(null);

  // 1) Pobieramy aktywność (bez mapy)
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/activities")
      .then((res) => {
        const found = res.data.find((a) => String(a.id) === String(id));
        setActivity(found || null);
      })
      .catch((err) => {
        console.error("Błąd przy pobieraniu aktywności:", err);
      });
  }, [id]);

  // 2) Gdy aktywność jest już znana – inicjalizujemy mapę + track
  useEffect(() => {
    if (!activity) return;

    // reset info o trasie przy zmianie aktywności
    setTrackInfo(null);

    // usuwamy starą mapę
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map("map").setView([51.111, 17.02], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    axios
      .get(`http://localhost:3000/api/activities/${id}/track`)
      .then((trackRes) => {
        const points = trackRes?.data?.points || [];
        if (!points.length) return;

        // START/META (skąd/dokąd)
        const start = points[0];
        const end = points[points.length - 1];
        setTrackInfo({ start, end });

        // polyline na mapie
        const latlngs = points.map((p) => [p.lat, p.lon]);
        const polyline = L.polyline(latlngs).addTo(map);
        map.fitBounds(polyline.getBounds());
      })
      .catch((err) => {
        console.error("Błąd przy pobieraniu śladu GPS:", err);
      });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [activity, id]);

  if (!activity) return <h2>Ładowanie...</h2>;

  const gpxUrl = `http://localhost:3000/api/activities/${id}/export.gpx`;

  const pace =
    activity.duration_min && activity.distance_km
      ? (Number(activity.duration_min) / Number(activity.distance_km))
      : null;

  const formatPace = (p) => {
    const totalSeconds = Math.round(p * 60);
    const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const ss = String(totalSeconds % 60).padStart(2, "0");
    return `${mm}:${ss} min/km`;
  };

  return (
    <>
      <h2>Szczegóły aktywności</h2>

      <p><b>Nazwa:</b> {activity.name}</p>
      <p><b>Typ:</b> {activity.type}</p>
      <p><b>Dystans:</b> {Number(activity.distance_km).toFixed(2)} km</p>
      <p><b>Czas:</b> {activity.duration_min} min</p>
      <p><b>Data startu:</b> {new Date(activity.started_at).toLocaleString()}</p>
      {pace && <p><b>Tempo:</b> {formatPace(pace)}</p>}

      {/* Skąd -> dokąd (z tracka) */}
      {trackInfo ? (
        <p>
          <b>Skąd → dokąd:</b>{" "}
          {trackInfo.start.lat.toFixed(5)},{trackInfo.start.lon.toFixed(5)}
          {"  →  "}
          {trackInfo.end.lat.toFixed(5)},{trackInfo.end.lon.toFixed(5)}
        </p>
      ) : (
        <p><b>Skąd → dokąd:</b> (brak tracka)</p>
      )}

      {/* Eksport GPX */}
      <p>
        <a
          href={gpxUrl}
          style={{
            display: "inline-block",
            padding: "8px 12px",
            border: "1px solid #333",
            textDecoration: "none",
            marginTop: "10px",
          }}
        >
          📥 Pobierz GPX
        </a>
      </p>

      <div
        id="map"
        style={{
          height: "400px",
          marginTop: "15px",
          border: "1px solid #333",
        }}
      />
    </>
  );
}
