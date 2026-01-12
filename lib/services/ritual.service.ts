
import prisma from "@/lib/prisma";
import dayjs from "dayjs";

export const RitualService = {
  async checkInRitual(userId: string, vow: string) {
    const today = dayjs().format("YYYY-MM-DD");
    return await prisma.ritual.create({
        data: {
            userId: userId,
            date: today,
            vow: vow,
            completedDailyCheckIn: false
        }
    });
  },

  async completeRitual(ritualId: string, userId: string) {
      return await prisma.ritual.update({
          where: { id: ritualId, userId: userId },
          data: { completedDailyCheckIn: true }
      });
  },

  async getRecentRituals(userId: string) {
    return await prisma.ritual.findMany({
        where: { userId: userId },
        orderBy: { date: 'desc' },
        take: 30
    });
  },

  async flushRituals(userId: string) {
      return await prisma.ritual.deleteMany({
          where: { userId: userId }
      });
  }
};
