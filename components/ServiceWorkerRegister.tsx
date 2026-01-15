"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IconBell, IconBellOff } from "@tabler/icons-react";

interface NotificationAction {
    action: string;
    title: string;
    icon?: string;
    type?: string;
    placeholder?: string;
}

interface ExtendedNotificationOptions extends NotificationOptions {
    actions?: NotificationAction[];
}

// Function to convert VAPID key to Uint8Array
const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export function ServiceWorkerRegister() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => {
                    console.log('Service Worker registered', reg);
                    setRegistration(reg);
                    
                    // Check existing subscription
                    reg.pushManager.getSubscription().then(sub => {
                        if (sub) {
                             setIsSubscribed(true);
                             // Optional: Re-sync subscription with backend here if needed
                        }
                    });
                })
                .catch(err => console.error('Service Worker registration failed', err));
        }
    }, []);

    const subscribe = async () => {
        if (!registration) return;

        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BNXdOLXOR4kGTndVs6K1rS4TC5Z0n2AT6kdu42EDAXFFx9iqh7jiIWjDXQvUxrtawgguSp4SE4KQEKW4G2VvmkI"; // Fallback to key found in .env
                const convertedKey = urlBase64ToUint8Array(vapidKey);

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedKey
                });

                // Send subscription to backend
                const response = await fetch('/api/notifications/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(subscription),
                });

                if (response.ok) {
                    setIsSubscribed(true);
                    toast.success("Notifications Enabled!");
                    
                    // Trigger welcome notification locally
                    registration.showNotification("Karman Active", {
                        body: "You will now receive compliance updates.",
                        icon: '/icons/icon-192x192.png',
                    });
                } else {
                    toast.error("Failed to register subscription on server");
                    console.error("Server subscription failed", await response.json());
                }
            } else {
                toast.error("Permission denied");
            }
        } catch (error) {
            console.error("Subscription error:", error);
            toast.error("Failed to subscribe");
        }
    };

    if (!isSubscribed) {
         return (
             <Button variant="ghost" size="sm" onClick={subscribe} className="text-xs text-muted-foreground gap-1">
                 <IconBellOff size={14} /> Enable Notifications
             </Button>
         )
    }

    return null; 
}
