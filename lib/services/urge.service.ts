
import prisma from "@/lib/prisma";

export const UrgeService = {
  async getUrges(userId: string, page: number = 1, limit: number = 10) {
      const skip = (page - 1) * limit;
      
      const [totalUrges, urges] = await prisma.$transaction([
          prisma.urge.count({ where: { userId: userId } }),
          prisma.urge.findMany({
              where: { userId: userId },
              skip,
              take: limit,
              orderBy: { id: 'desc' }
          })
      ]);
      
      const totalPages = Math.ceil(totalUrges / limit);
            
      return {
          totalPages,
          currentPage: page,
          totalUrgeCount: totalUrges,
          urges
      };
  },

  async logUrge(userId: string, data: any) {
      return await prisma.urge.create({
          data: {
              ...data,
              userId: userId
          }
      });
  },

  async resolveUrge(userId: string, id: string) {
       // Legacy: `Urges.findOneAndUpdate(urgeId)` ???
       // The controller `resolveUrge` did `const res = await Urges.findOneAndUpdate(urgeId);`.
       // `findOneAndUpdate` with just ID as first arg? That just finds it and returns it, does NOT update anything unless second arg is provided.
       // It seems legacy `resolveUrge` was broken or I misread?
       // `res.send("OK")` was sent.
       // Assuming functionality is to mark as resolved?
       // `Urge` model has `urgeResolved Boolean @default(false)`.
       // I'll assume it sets `urgeResolved: true`.
       
       const exists = await prisma.urge.findFirst({ where: { id, userId: userId } });
       if (!exists) throw new Error("Urge not found");

       return await prisma.urge.update({
           where: { id },
           data: { urgeResolved: true }
       });
  }
};
