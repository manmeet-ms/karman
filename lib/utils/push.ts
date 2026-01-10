
import webpush from "web-push";
import prisma from "@/lib/prisma";

const publicVapidKey = process.env.VITE_WEBPUSH_PUBLIC_KEY;
const privateVapidKey = process.env.VITE_WEBPUSH_PRIVATE_KEY;
const webPushEmail = process.env.VITE_WEBPUSH_EMAIL;

if (!publicVapidKey || !privateVapidKey) {
  console.error("VAPID keys are missing from environment variables.");
  // Don't throw to allow build, but runtime will fail if used
} else {
    webpush.setVapidDetails(
      `mailto:${webPushEmail}`,
      publicVapidKey,
      privateVapidKey
    );
}

export const sendNotification = async (subscriptionRaw: any, payload: any) => {
  try {
    // Subscription might be stored with keys as Json, or separate fields.
    // Prisma `PushSubscription` model has `keys Json?` and `endpoint String`.
    // web-push expects subscription object.
    
    // Ensure subscription has keys
    if (!subscriptionRaw.keys) return;

    // Construct valid subscription object for web-push
    const subscription = {
        endpoint: subscriptionRaw.endpoint,
        keys: subscriptionRaw.keys as any
    };

    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (err: any) {
    if (err.statusCode === 410 || err.statusCode === 404) {
      console.log("Subscription expired, removing:", subscriptionRaw.endpoint);
      await prisma.pushSubscription.delete({ where: { endpoint: subscriptionRaw.endpoint } }).catch(e => console.error(e));
    } else {
      console.error("Push error", err);
    }
  }
};
