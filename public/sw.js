// Onlizas Admin - Service Worker for Web Push Notifications

self.addEventListener("push", function (event) {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch (e) {
    return;
  }

  const { title, body, icon, badge, url, tag } = payload;

  const notificationTitle = title ?? "Onlizas";
  const notificationOptions = {
    body: body ?? "",
    icon: icon ?? "/assets/images/NEWZAS.svg",
    badge: badge ?? "/assets/images/NEWZAS.svg",
    tag: tag ?? "onlizas-notification",
    data: { url: url ?? "/dashboard/notifications" },
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions),
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const targetUrl = event.notification.data?.url ?? "/dashboard/notifications";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (windowClients) {
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});
