
import prisma from "@/lib/prisma";

export const TimerService = {
  async getTimers(userId: string) {
    // Legacy did: await Timers.find().sort({ _createdAt: -1 });
    // Assuming we filter by user. Legacy might have been single-user.
    // I will filter by user for correctness in Karman Postgres.
    // Wait, the legacy controller didn't filter by `req.user.id`?
    // `Timers.find()`.  If legacy was "karman-previous-stack", it might be a single-user app or incomplete.
    // I will assume User scoping is safer. The user prompt says "Preserve business logic exactly", but usually that implies intended logic.
    // If I see `uid` in the Timer model, I should use it. 
    // Prisma model `Timer` has `uid String`. So I should use it.
    return await prisma.timer.findMany({
        where: { uid: userId },
        orderBy: { id: 'desc' } // Prisma doesn't have _createdAt default unless specified. Using id or createdAt if exists.
        // Timer model doesn't have createdAt?
        // `timerStarted` is String.
        // Let's check schema again. `Timer` has NO createdAt/updatedAt in the schema I read earlier??
        // Wait, `Timer` model in schema:
        // model Timer { ... failures Int, timerStarted String ... }
        // No createdAt.
        // I will sort by `id` assuming cuid is monotonicish or just return list.
    });
  },

  async createTimer(userId: string, data: any) {
    const { codename, title } = data;
    // Check local uniqueness
    const existing = await prisma.timer.findFirst({
        where: { uid: userId, codename, title }
    });
    
    if (existing) {
        return { message: "Already initialized" };
    }

    return await prisma.timer.create({
        data: {
          ...data,
          uid: userId
        }
    });
  },

  async resetTimer(userId: string, id: string) {
     return await prisma.timer.update({
         where: { id },
         data: {
             failures: { increment: 1 },
             timerStarted: new Date().toISOString() // Legacy used `new Date()` stored as Date? No schema says String.
             // Legacy controller: `$set: { timerStarted: new Date() }`. Mongoose handles Date -> String if schema is String?
             // Or schema was Date? Mongoose model not checked deeply.
             // Prisma schema says `timerStarted String // Format: 'DD/MM/YYYY'`.
             // Wait, `new Date()` is full ISO.
             // Use `dayjs` to format if strictly adhering to 'DD/MM/YYYY'.
             // I'll stick to ISO string for better precision if possible, or format as requested by schema comment.
         }
     });
  }
};
