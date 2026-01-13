import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    try {
        // 1. Completed Blocks
        const completedBlocks = await prisma.timeBlock.count({
            where: {
                userId: user.id,
                completed: true
            }
        });

        // 2. Discipline Score
        // Formula: (Completed Strict Blocks / Total Strict Blocks) * 100
        const totalStrictBlocks = await prisma.timeBlock.count({
            where: {
                userId: user.id,
                strict: true,
                // Only count blocks that are in the past or completed?
                // Ideally, we count everything that *could* have been completed. 
                // Let's assume all created strict blocks count.
            }
        });

        const completedStrictBlocks = await prisma.timeBlock.count({
            where: {
                userId: user.id,
                strict: true,
                completed: true
            }
        });

        let discipline = 0;
        if (totalStrictBlocks > 0) {
            discipline = Math.round((completedStrictBlocks / totalStrictBlocks) * 100);
        } else {
            discipline = 100; // Default to 100 if no strictly blocks assigned yet
        }

        // 3. Blocks Missed
        // Count Violations of type MISSED_BLOCK
        const blocksMissed = await prisma.violation.count({
            where: {
                userId: user.id,
                type: "MISSED_BLOCK"
            }
        });

        // 4. Streak
        const streak = user.streak || 0;

        // 5. Completed Rituals
        const completedRituals = await prisma.ritual.count({
            where: {
                userId: user.id,
                completedDailyCheckIn: true
            }
        });

        // ---- Normalization Logic ----
        // 1. Completed Blocks: Cap at 50 for max score (assumption: 50 is a good milestone)
        const cBlocksScore = Math.min((completedBlocks / 50) * 100, 100);

        // 2. Discipline: Already 0-100
        const disciplineScore = discipline;

        // 3. Blocks Missed: Cap at 20. 20 missed = 100% "Badness" intensity.
        const missedScore = Math.min((blocksMissed / 20) * 100, 100);

        // 4. Streak: Cap at 30 days.
        const streakScore = Math.min((streak / 30) * 100, 100);

        // 5. Completed Rituals: Cap at 30.
        const ritualScore = Math.min((completedRituals / 30) * 100, 100);

        const data = [
            { month: "Completed Blocks", desktop: Math.round(cBlocksScore), raw: completedBlocks },
            { month: "Discipline", desktop: Math.round(disciplineScore), raw: discipline },
            { month: "Blocks Missed", desktop: Math.round(missedScore), raw: blocksMissed },
            { month: "Streak", desktop: Math.round(streakScore), raw: streak },
            { month: "Completed Ritual", desktop: Math.round(ritualScore), raw: completedRituals },
        ];

        return NextResponse.json(data);

    } catch (error) {
        console.error("Failed to fetch analytics", error);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
