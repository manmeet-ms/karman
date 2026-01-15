
import prisma from "@/lib/prisma";
import { sendNotification } from "@/lib/utils/push";

export const NotificationService = {
  async saveSubscription(userId: string, endpoint: string, keys: any) {
    const existing = await prisma.pushSubscription.findUnique({
        where: { endpoint }
    });

    if (!existing) {
        await prisma.pushSubscription.create({
            data: { 
                endpoint, 
                keys,
                user: { connect: { id: userId } }
            }
        });
    }
    return { message: 'Subscription saved' };
  },

  async triggerNotification(payload: any) {
      const subscriptions = await prisma.pushSubscription.findMany();
      if (!subscriptions.length) return;

      const promises = subscriptions.map(sub => sendNotification(sub, payload));
      await Promise.all(promises);
  },

  async testNotify() {
      const subscription = await prisma.pushSubscription.findFirst();
       if (!subscription) throw new Error("No subscriptions found");
       
       await sendNotification(subscription, {
          title: "Test Notification",
          body: "If you see this, push is working!"
       });
  }
};
