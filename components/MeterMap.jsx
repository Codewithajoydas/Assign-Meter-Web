"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MeterMap({ devices = [] }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || devices.length === 0) return;

    if (devices.length === 1) {
      mapRef.current.setView([devices[0].latitude, devices[0].longitude], 17);
    } else {
      const bounds = L.latLngBounds(
        devices.map((d) => [d.latitude, d.longitude]),
      );

      mapRef.current.fitBounds(bounds, {
        padding: [50, 50],
      });
    }
  }, [devices]);

  if (!devices.length) return null;

  return (
    <MapContainer
      ref={mapRef}
      center={[devices[0].latitude, devices[0].longitude]}
      zoom={16}
      style={{
        width: "100%",
        height: "75vh",
        borderRadius: "12px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {devices.map((device) => (
        <>
          {device.accuracy && (
            <Circle
              key={`circle-${device.id}`}
              center={[device.latitude, device.longitude]}
              radius={device.accuracy}
              pathOptions={{
                color: "#2563EB",
                fillColor: "#2563EB",
                fillOpacity: 0.1,
              }}
            />
          )}

          <Marker
            key={device.id}
            position={[device.latitude, device.longitude]}
          >
            <Popup>
              <div style={{ minWidth: 220 }}>
                <h3
                  style={{
                    margin: 0,
                    marginBottom: 8,
                    fontWeight: "bold",
                  }}
                >
                  {device.name || "Unknown Device"}
                </h3>

                {device.localName && (
                  <p>
                    <strong>Local Name:</strong> {device.localName}
                  </p>
                )}

                <p>
                  <strong>Device ID:</strong> {device.deviceId}
                </p>

                <p>
                  <strong>Latitude:</strong> {device.latitude.toFixed(6)}
                </p>

                <p>
                  <strong>Longitude:</strong> {device.longitude.toFixed(6)}
                </p>

                {device.accuracy && (
                  <p>
                    <strong>Accuracy:</strong> ±{Math.round(device.accuracy)} m
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        </>
      ))}
    </MapContainer>
  );
}
