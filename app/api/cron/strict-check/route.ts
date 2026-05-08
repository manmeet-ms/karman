import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import { PointsService } from "@/lib/services/points.service";

export async function GET(req: NextRequest) {
    try {
        const urlOptions = new URL(req.url);
        const userId = urlOptions.searchParams.get("userId");
        if (!userId) {
             return NextResponse.json({ error: "userId required for strict-check" }, { status: 400 });
        }

        const now = dayjs();
        const today = now.format("YYYY-MM-DD");
        const currentTime = now.format("HH:mm");

        // 1. Check for missed strict Timeblocks today
        const timeBlocks = await prisma.timeBlock.findMany({
            where: {
                userId,
                date: today,
                strict: true,
                completed: false,
                endTime: { lt: currentTime } // Time has passed
            }
        });

        const newViolations = [];
        for (const block of timeBlocks) {
            // Check if violation already exists for this block today
            const existingViolation = await prisma.violation.findFirst({
                where: {
                    userId,
                    type: "MISSED_BLOCK",
                    dateString: today,
                    // Optionally we could store blockId in blockData, but we'll use a metadata check if we want,
                    // for now, just don't duplicate via basic block task check in blockData
                    blockData: {
                        path: ['task'],
                        equals: block.task
                    }
                }
            });

            if (!existingViolation) {
                // Create violation
                const v = await prisma.violation.create({
                    data: {
                        userId: userId,
                        type: 'MISSED_BLOCK',
                        timestamp: new Date(),
                        tauntStatement: `You missed your strict block: ${block.task}!`,
                        dateString: today,
                        blockData: {
                            id: block.id,
                            task: block.task,
                            startTime: block.startTime,
                            endTime: block.endTime
                        }
                    }
                });
                newViolations.push(v);
                
                // Deduct points
                await PointsService.applyPoints(userId, 'BLOCK_MISS_PENALTY');
            }
        }

        return NextResponse.json({ 
            success: true, 
            checkedBlocks: timeBlocks.length, 
            newViolations: newViolations.length 
        });
    } catch (error) {
        console.error("Failed strict-check", error);
        return NextResponse.json({ error: "Failed strict-check" }, { status: 500 });
    }
}
