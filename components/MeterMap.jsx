"use client";

import { useState, useMemo, useCallback } from "react";
import {
  GoogleMap,
  MarkerF,
  InfoWindowF,
  CircleF,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "75vh" };

export default function MeterMap({ devices = [] }) {
  const [activeId, setActiveId] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const center = useMemo(() => {
    if (devices.length === 0) return { lat: 0, lng: 0 };
    return { lat: devices[0].latitude, lng: devices[0].longitude };
  }, [devices]);

  // Fit bounds to include every device once the map mounts.
  const onLoad = useCallback(
    (map) => {
      if (devices.length > 1) {
        const bounds = new window.google.maps.LatLngBounds();
        devices.forEach((d) =>
          bounds.extend({ lat: d.latitude, lng: d.longitude })
        );
        map.fitBounds(bounds, 50);
      }
    },
    [devices]
  );

  if (devices.length === 0) return null;
  if (!isLoaded) return null;

  const activeDevice = devices.find((d) => d.id === activeId);

  return (
    <GoogleMap
      mapContainerClassName="h-full w-full rounded-lg"
      
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
      onLoad={onLoad}
      options={{
        streetViewControl: true,
        mapTypeControl: true,
        cameraControl: true,
      }}
    >
      {devices.map((d) => (
        <div key={d.id}>
          {d.accuracy ? (
            <CircleF
              center={{ lat: d.latitude, lng: d.longitude }}
              radius={d.accuracy}
              options={{
                strokeColor: "#2563EB",
                strokeWeight: 1,
                fillColor: "#2563EB",
                fillOpacity: 0.08,
              }}
            />
          ) : null}

          <MarkerF
            position={{ lat: d.latitude, lng: d.longitude }}
            onClick={() => setActiveId(d.id)}
          />
        </div>
      ))}

      {activeDevice && (
        <InfoWindowF
          position={{ lat: activeDevice.latitude, lng: activeDevice.longitude }}
          onCloseClick={() => setActiveId(null)}
        >
          <div className="text-sm">
            <p className="font-semibold">{activeDevice.name}</p>
            {activeDevice.localName && <p>{activeDevice.localName}</p>}
            <p className="text-gray-500 text-xs mt-1">
              {activeDevice.deviceId}
            </p>
            <p className="text-gray-500">
              {activeDevice.latitude.toFixed(6)},{" "}
              {activeDevice.longitude.toFixed(6)}
            </p>
            {activeDevice.accuracy && (
              <p className="text-gray-400">
                ±{Math.round(activeDevice.accuracy)}m accuracy
              </p>
            )}
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}