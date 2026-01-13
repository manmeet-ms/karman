import prisma from "@/lib/prisma";
import { TxnType } from "@/generated/prisma/enums";

export const EVENT_POINTS = {
  TIMEBLOCK_COMPLETE_CREDIT: 20,
  ALL_DAILY_COMPLETE_CREDIT: 100,
  VIOLATION_RESOLVED_CREDIT: 5,
  DIARY_WRITING_CREDIT: 5,
  RITUAL_CREATED_CREDIT: 5, // Not in TxnType enum?
  RITUAL_COMPLETE_CREDIT: 10,
  URGE_LOGGED_CREDIT: 10,
  URGE_RESISTED_CREDIT: 50,
  MOOD_LOGGED_CREDIT: 5,
  MOOD_IMPROVEMENT_CREDIT: 5,
  NEW_STREAK_CREDIT: 50,
  EXTEND_STREAK_CREDIT: 10,

  RITUAL_MISS_PENALTY: -10,
  URGE_FAILURE_PENALTY: -100,
  BLOCK_MISS_PENALTY: -40,
  STREAK_BREAK_PENALTY: -100,
  VIOLATION_PENALTY: -60,
  TIMER_RESET_PENALTY: -800,
  PUNISHMENT_TRIGGER_PENALTY: -30,
  DEFAULT: 0,
};

export type EventPointKey = keyof typeof EVENT_POINTS;

export async function applyPoints(userId: string, type: TxnType, metadata?: any) {
    const points = EVENT_POINTS[type as keyof typeof EVENT_POINTS] || 0;
    
    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
        // 1. Get current user
        const user = await tx.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("User not found");

        const newBalance = user.points + points;

        // 2. Create transaction record
        await tx.pointsTxn.create({
            data: {
                userId,
                type,
                points,
                balanceAfter: newBalance,
                metadata: metadata || {}
            }
        });

        // 3. Update user points
        const updatedUser = await tx.user.update({
            where: { id: userId },
            data: { points: newBalance }
        });

        return updatedUser;
    });

    return result;
}
