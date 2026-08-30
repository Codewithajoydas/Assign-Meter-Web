self.addEventListener("push", (event) => {
  console.log("PUSH RECEIVED");

  let data = {
    title: "New Notification",
    body: "",
    url: "/",
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (error) {
      console.log("Push payload is not JSON");

      data.body = event.data.text();
    }
  }

  console.log("Push data:", data);

  event.waitUntil(
    self.registration.showNotification(
      data.title || "New Notification",
      {
        body: data.body || "",
        icon: "/icon.png",

        // Data that will be available
        // when notification is clicked.
        data: {
          url: data.url || "/",
        },
      },
    ),
  );
});


// ============================================================
// NOTIFICATION CLICK
// ============================================================

self.addEventListener("notificationclick", (event) => {
  console.log("NOTIFICATION CLICKED");

  // Close notification
  event.notification.close();

  // Get URL from notification data
  const url =
    event.notification.data?.url || "/";

  console.log("Opening URL:", url);

  event.waitUntil(
    clients.openWindow(url),
  );
});