
import webPush, { PushSubscription } from 'web-push';
import prisma from './prisma';

// Configure web-push
if (!process.env.WEBPUSH_PUBLIC_KEY || !process.env.WEBPUSH_PRIVATE_KEY) {
    console.error("VAPID keys are missing from environment variables.");
} else {
    webPush.setVapidDetails(
        `mailto:${process.env.WEBPUSH_EMAIL || 'admin@example.com'}`,
        process.env.WEBPUSH_PUBLIC_KEY,
        process.env.WEBPUSH_PRIVATE_KEY
    );
}

interface NotificationPayload {
    title: string;
    body: string;
    url?: string;
    actions?: any[];
}

/**
 * Sends a push notification to a specific user.
 * It fetches all active subscriptions for the user and sends the payload to each.
 */
export async function sendNotificationToUser(userId: string, payload: NotificationPayload) {
    const subscriptions = await prisma.pushSubscription.findMany({
        where: { userId },
    });

    if (subscriptions.length === 0) {
        return { success: false, message: "No subscriptions found for user" };
    }

    const payloadString = JSON.stringify(payload);
    let successCount = 0;
    let failCount = 0;

    const promises = subscriptions.map(async (sub) => {
        try {
            const pushConfig = {
                endpoint: sub.endpoint,
                keys: sub.keys as any, // Type cast JSON to keys object
            };

            await webPush.sendNotification(pushConfig, payloadString);
            successCount++;
        } catch (error: any) {
            console.error(`Error sending push to ${sub.id}:`, error);
            failCount++;

            if (error.statusCode === 410 || error.statusCode === 404) {
                // Subscription is invalid or expired, remove it
                await prisma.pushSubscription.delete({
                    where: { id: sub.id },
                });
                console.log(`Deleted expired subscription ${sub.id}`);
            }
        }
    });

    await Promise.all(promises);

    return {
        success: true,
        sent: successCount,
        failed: failCount,
        total: subscriptions.length
    };
}
