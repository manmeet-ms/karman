
import prisma from "@/lib/prisma";
import { EVENT_POINTS, EventPointKey } from "@/lib/points";
import { TxnType } from "@/generated/prisma/client";

export const PointsService = {
  async applyPoints(userId: string, eventKey: EventPointKey) {
    if (!EVENT_POINTS.hasOwnProperty(eventKey)) {
      throw new Error(`Invalid event type: ${eventKey}`);
    }

    const delta = EVENT_POINTS[eventKey];

    // Transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new Error("User not found");

      const currentPoints = user.points;
      const finalPoints = currentPoints + delta;

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { points: finalPoints },
      });

      await tx.pointsTxn.create({
        data: {
          userId: userId,
          type: eventKey as TxnType,
          points: delta,
          balanceAfter: finalPoints,
        },
      });

      return {
        points: finalPoints,
        delta,
        user: updatedUser,
      };
    });

    return result;
  },

  async getLedger(userId: string) {
    return await prisma.pointsTxn.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });
  },
};
