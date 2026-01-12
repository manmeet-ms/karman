"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IconBell, IconBellOff } from "@tabler/icons-react";

export function ServiceWorkerRegister() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => {
                    console.log('Service Worker registered', reg);
                    setRegistration(reg);
                    // Check if already subscribed or permission granted
                    if (Notification.permission === 'granted') {
                        setIsSubscribed(true);
                    }
                })
                .catch(err => console.error('Service Worker registration failed', err));
        }
    }, []);

    const subscribe = async () => {
        if (!registration) return;
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            setIsSubscribed(true);
            toast.success("Notifications Enabled!");
            
            // Trigger a test notification immediately to confirm logic
            // In a real app, this would be triggered by the server via Push API
            // Here we use the SW registration to show a local notification for demo/testing
            registration.showNotification("Karman Active", {
                body: "This is a test notification. Reply to test input!",
                icon: '/icons/icon-192x192.png',
                 actions: [
                    {
                        action: 'checkin-reply',
                        type: 'text',
                        title: 'Quick Check-in',
                        placeholder: 'What are you doing?'
                    }
                ]
            });
        } else {
            toast.error("Permission denied");
        }
    };

    if (!isSubscribed) {
         return (
             <Button variant="ghost" size="sm" onClick={subscribe} className="text-xs text-muted-foreground gap-1">
                 <IconBellOff size={14} /> Enable Notifications
             </Button>
         )
    }

    return null; // Or show settings
    // return (
    //     <Button variant="ghost" size="sm" onClick={() => subscribe()} className="text-xs text-primary gap-1">
    //          <IconBell size={14} /> Test
    //      </Button>
    // )
}
