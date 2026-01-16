
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "Time for a Check-in?";
    const options = {
        body: data.body || "How are you feeling right now? Share a thought.",
        icon: '/logo.svg',
        badge: '/logo.svg',
        data: { url: data.url || '/' },
        actions: [
            {
                action: 'checkin-reply',
                type: 'text',
                title: 'Share Thought',
                placeholder: 'Feeling focused...'
            },
            {
                action: 'open-app',
                title: 'Open App'
            }
        ]
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'checkin-reply' && event.reply) {
        // User typed a reply in the notification
        const note = event.reply;
        
        // Send to API
        event.waitUntil(
            fetch('/api/timeline', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    note: note,
                    tag: "Notification Check-in",
                    mood: {
                        moodType: "NEUTRAL", // Default, can't select mood details in simple text reply
                        intensity: 5
                    }
                })
            }).then(response => {
                if (response.ok) {
                    // Optional: Show a confirmation notification
                    self.registration.showNotification("Check-in Logged!", {
                        body: "Your thought has been recorded.",
                        icon: '/icons/icon-192x192.png'
                    });
                }
            })
        );

    } else {
        // Default action or Open App
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
                if (clientList.length > 0) {
                    let client = clientList[0];
                    for (let i = 0; i < clientList.length; i++) {
                        if (clientList[i].focused) {
                            client = clientList[i];
                        }
                    }
                    return client.focus();
                }
                return clients.openWindow('/');
            })
        );
    }
});
