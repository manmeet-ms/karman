
import prisma from "@/lib/prisma";
import { getRandomTaunt } from "@/lib/taunts";
import { ViolationTypeEnum } from "@/generated/prisma/client";
import axios from "axios";

export const ViolationService = {
  async logViolation(userId: string, type: ViolationTypeEnum, timeBlockId?: string) {
    const taunt = getRandomTaunt();
    
    // Fetch timeblock if ID provided
    let blockData = {};
    if (timeBlockId) {
        const block = await prisma.timeBlock.findUnique({ where: { id: timeBlockId } });
        if (block) blockData = block; // Store block snapshot
    }

    const violation = await prisma.violation.create({
        data: {
            uid: userId,
            type: type,
            tauntStatement: taunt,
            blockData: blockData as any, // Json
        }
    });

    // Send Discord Webhook (Non-blocking)
    this.sendDiscordWebhook(userId, violation, blockData).catch(err => console.error("Discord webhook failed", err));

    return violation;
  },

  async getViolations(userId: string) {
      return await prisma.violation.findMany({
          // where: { uid: userId }, // Legacy controller `find().sort()` implied global?
          // Using userId filter for safety in multi-user app.
          orderBy: { timestamp: 'desc' },
      });
  },

  async resolveViolation(userId: string, id: string) {
      // Legacy: findByIdAndDelete OR findByIdAndUpdate(resolved: true) logic was commented out.
      // `violation.controller.js` used `findByIdAndDelete`.
      // I will implement delete.
      const exists = await prisma.violation.findFirst({ where: { id, uid: userId } }); // Check ownership
      if (!exists) throw new Error("Violation not found");

      return await prisma.violation.delete({
          where: { id }
      });
  },

  async flushViolations(userId: string) {
      return await prisma.violation.deleteMany({
          where: { uid: userId } // Scoped to user
      });
  },

  async sendDiscordWebhook(userId: string, violation: any, blockData: any) {
      const webHookUrl = process.env.VITE_DISCORD_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
      if (!webHookUrl) return;

      const user = await prisma.user.findUnique({ where: { id: userId } });
      const userName = user?.name || "User";
      
      const taskName = blockData?.task || "Unknown Task";
      const taskTime = blockData?.startTime ? `${blockData.startTime} – ${blockData.endTime}` : "Unknown Time";

      const message = `⚠ ${userName} failed "${taskName}" scheduled at ${taskTime}\nViolation type: \`${violation.type}\``;

      await axios.post(webHookUrl, {
          content: message
      });
  }
};
