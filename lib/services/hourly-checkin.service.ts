
import prisma from "@/lib/prisma";
import dayjs from "dayjs";

export const HourlyCheckinService = {
  async getTodayCheckins(userId: string) {
    const today = dayjs().format("YYYY-MM-DD");
    return await prisma.hourlyCheckin.findMany({
        where: { userId: userId, entryDate: today },
        orderBy: { createdAt: 'desc' },
        include: { mood: true } // Include embedded mood relation if possible
    });
  },

  async createCheckin(userId: string, data: any) {
    const { note, tag, context, mood } = data;
    const entryDate = dayjs().format("YYYY-MM-DD");
    
    // Create checkin
    const checkin = await prisma.hourlyCheckin.create({
        data: {
            userId: userId,
            note: note,
            tag: tag,
            context: context,
            entryDate: entryDate,
        }
    });

    // If mood is present, we might need to create a Mood relation or Embedded document
    // Prisma model `HourlyCheckin` has `mood Mood?`
    // If mood data is passed, we should create it.
    if (mood) {
        // ... logic to create mood
        // This depends on how Mood is structured in Prisma and what `mood` data looks like
    }

    return checkin;
  },

  async updateCheckin(userId: string, id: string, data: any) {
    // Check ownership
    const exists = await prisma.hourlyCheckin.findFirst({
        where: { id, userId: userId }
    });
    if (!exists) throw new Error("Check-in not found");

    return await prisma.hourlyCheckin.update({
        where: { id },
        data: data
    });
  },

  async deleteCheckin(userId: string, id: string) {
     const exists = await prisma.hourlyCheckin.findFirst({
        where: { id, userId: userId }
    });
    if (!exists) throw new Error("Check-in not found");

    return await prisma.hourlyCheckin.delete({
        where: { id }
    });
  }
};
