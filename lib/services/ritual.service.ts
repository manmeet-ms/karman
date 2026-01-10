
import prisma from "@/lib/prisma";
import dayjs from "dayjs";

export const RitualService = {
  async checkInRitual(userId: string, vow: string) {
    const today = dayjs().format("YYYY-MM-DD");
    return await prisma.ritual.create({
        data: {
            uid: userId,
            date: today,
            vow: vow,
            completedDailyCheckIn: true
        }
    });
  },

  async getTodayRitual(userId: string) {
    const today = dayjs().format("YYYY-MM-DD");
    // Controller logic was commented out: // const ritual = await Ritual.find({ date: today })
    // But then: const ritual = await Ritual.find({uid:req.user.id})
    // It seems it returned ALL rituals for user? Or just today's?
    // Function name is `getTodayRitual`.
    // I will filter by today to be safe and correct per name.
    return await prisma.ritual.findMany({
        where: { uid: userId, date: today }
    });
  },

  async flushRituals(userId: string) {
      return await prisma.ritual.deleteMany({
          where: { uid: userId }
      });
  }
};
