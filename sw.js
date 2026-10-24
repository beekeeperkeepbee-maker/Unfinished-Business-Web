// Service Worker for Unfinished Business notifications
self.addEventListener("notificationclick", function(event) {
    event.notification.close();
    // Focus the existing tab if it's open
    event.waitUntil(
        clients.matchAll({ type: "window" }).then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url.includes(self.location.origin) && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow("/");
            }
        })
    );
});
