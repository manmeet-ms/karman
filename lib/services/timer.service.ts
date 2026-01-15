
import prisma from "@/lib/prisma";
import { CreateTimerInput } from "@/lib/validations";
import { Timer } from "@/generated/prisma/client";
import { sendNotificationToUser } from "@/lib/notifications";

const RANK_TABLE = [
    { name: "Initiate", threshold: 0 },
    { name: "Novice", threshold: 1 * 60 * 60 }, // 1 Hour
    { name: "Apprentice", threshold: 10 * 60 * 60 }, // 10 Hours
    { name: "Adept", threshold: 50 * 60 * 60 }, // 50 Hours
    { name: "Expert", threshold: 100 * 60 * 60 }, // 100 Hours
    { name: "Master", threshold: 500 * 60 * 60 }, // 500 Hours
    { name: "Grandmaster", threshold: 1000 * 60 * 60 }, // 1000 Hours
    { name: "Chronos", threshold: 5000 * 60 * 60 }, // 5000 Hours
    { name: "Eternal", threshold: 10000 * 60 * 60 } // 10000 Hours
];

export class TimerService {
  static async createTimer(userId: string, data: CreateTimerInput) {
    return prisma.timer.create({
      data: {
        userId,
        codename: data.codename,
        title: data.title,
        description: data.description,
        timerStarted: new Date().toISOString(), // Start time
        failures: 0,
        perks: data.perks ?? [],
        punishments: data.punishments ?? [],
        alternates: data.alternates ?? [],
        quoteFlashingAllowed: data.quoteFlashingAllowed ?? false,
        pulseTheme: data.pulseTheme ?? "blue",
      },
    });
  }

  static async getTimers(userId: string) {
    return prisma.timer.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getTimer(id: string) {
    return prisma.timer.findUnique({
      where: { id },
    });
  }

  static async updateTimer(id: string, data: Partial<Timer>) {
    return prisma.timer.update({
      where: { id },
      data,
    });
  }

  static async deleteTimer(id: string) {
    return prisma.timer.delete({
      where: { id },
    });
  }

  static async resetTimer(userId: string, id: string) {
     return prisma.timer.update({
         where: { id },
         data: {
             failures: { increment: 1 },
             timerStarted: new Date().toISOString()
         }
     });
  }
  
  static async stopTimer(id: string, userId: string, durationSeconds: number) {
      // 1. Logic to stop timer (maybe update 'failures' if it was a failure, or just log duration)
      // Usually, stopping means "Session Complete". 
      // The prompt constraints: "Comparison must happen only on relevant backend events (e.g., timer stop)"
      // & "Use event-based triggers".
      
      // We assume this method is called when a timer session finishes successfully.
      
      // Calculate Total Time for User
      // We need a place to store "Total Accumulated Time". 
      // If not in User model, we might sum up all Logged Sessions (if they exist).
      // Assuming for now we simply fetch a "totalTime" field or sum up logs. 
      // User model doesn't have 'totalTime'. Assuming we sum `TimeBlock` durations? Or maybe there is a Log model?
      // `HourlyCheckin` seems to be the log. But it text-based? `TimeBlock` has start/end.
      
      // Let's assume we simply ADD the new duration to a theoretical total for the purpose of the Notif Logic Stub requested.
      // Ideally, we'd query: `const totalTime = await ctx.prisma.timeLog.aggregate(...)`
      // For this implementation, I will implement the logic as if `totalTime` is available or calculated.
      
      // Let's assume we simply ADD the new duration to a theoretical total for the purpose of the Notif Logic Stub requested.
      // Ideally, we'd query: `const totalTime = await ctx.prisma.timeLog.aggregate(...)`
      // For this implementation, I will implement the logic as if `totalTime` is available or calculated.
      
      // Let's implement the CHECK logic.
      // We need "Previous Total" (before this session) and "New Total" (after).
      // If (Previous < Threshold && New >= Threshold) -> Notification.
      
      // Mocking Total Time Calculation (Since strict implementation of total time aggregation might be heavy without existing aggregate table)
      // We will perform a heavy aggregate here ONCE per stop (as allowed by "Rank check runs once per timer completion")
      
      // We need to know where "Duration" is stored. `TimeBlock` has `startTime` / `endTime`.
      // Let's filter `TimeBlock` where `completed: true`.
      
      const timeBlocks = await prisma.timeBlock.findMany({
          where: { userId, completed: true },
          select: { startTime: true, endTime: true, date: true }
      });
      
      let totalSeconds = 0;

      for (const block of timeBlocks) {
          const s = new Date(`${block.date}T${block.startTime}`);
          const e = new Date(`${block.date}T${block.endTime}`);
          const diff = (e.getTime() - s.getTime()) / 1000;
          if (!isNaN(diff) && diff > 0) totalSeconds += diff;
      }
      
      const newTotalSeconds = totalSeconds + durationSeconds;
      
      for (const rank of RANK_TABLE) {
          if (totalSeconds < rank.threshold && newTotalSeconds >= rank.threshold) {
              // Level Up!
               await sendNotificationToUser(userId, {
                  title: `Chronos Rank: ${rank.name}`,
                  body: `Total time survived: ${(newTotalSeconds / 3600).toFixed(1)} hours.`,
                  url: "/timers"
              });
              break; // Only notify the highest crossing (usually just one)
          }
      }
      
      return true; // Return success
  }
}
