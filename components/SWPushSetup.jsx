// components/SWPushSetup.jsx
"use client";

import { useEffect, useState } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY; // set in .env

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  console.log("Padding: ", padding);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  console.log("Base64: ", base64);
  const rawData = atob(base64);
  console.log("Raw Data: ", rawData);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

async function subscribeUser() {
  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    // Send subscription to your backend to store against the user
    await fetch("/api/notification-subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });
  } catch (err) {
    console.error("Push subscription failed:", err);
  }
}

export default function SWPushSetup() {
  const [permission, setPermission] = useState(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default",
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

    // Register service worker once, regardless of permission state
    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.error("SW registration failed:", err));

    // Only prompt if user hasn't decided yet ("default")
    if (Notification.permission === "default") {
      // Slight delay avoids the "asks permission on load" UX pattern browsers dislike
      const timer = setTimeout(async () => {
        try {
          const result = await Notification.requestPermission();
          setPermission(result);
          if (result === "granted") {
            await subscribeUser();
          }
        } catch (err) {
          console.error("Permission request failed:", err);
        }
      }, 1500);

      return () => clearTimeout(timer);
    }

    // Already granted earlier — make sure subscription still exists
    if (Notification.permission === "granted") {
      subscribeUser();
    }
  }, []);

  return null; // no UI, runs silently
}
