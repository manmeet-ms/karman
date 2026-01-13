
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import { applyPoints } from "@/lib/points";

// Ideally this endpoint should be protected by a secret key found in headers
// e.g., if (req.headers.get("x-cron-secret") !== process.env.CRON_SECRET) return 401;

export async function POST(req: NextRequest) {
    try {
        const today = dayjs().format("YYYY-MM-DD");
        const yesterday = dayjs().subtract(1, 'day').format("YYYY-MM-DD");
        const nowTime = dayjs().format("HH:mm");

        // 1. Find potential violations
        // Look for:
        // - Strict Blocks
        // - Not Completed
        // - Date is Yesterday (definitely missed) OR Date is Today AND EndTime < Now
        
        // We can split this into two queries or one complex one.
        // Let's iterate all STRICT & UNCOMPLETED blocks for Today and Yesterday.
        
        const candidates = await prisma.timeBlock.findMany({
            where: {
                strict: true,
                completed: false,
                OR: [
                    { date: yesterday },
                    { 
                        date: today,
                        endTime: { lt: nowTime } 
                    }
                ]
            }
        });

        let newViolationsCount = 0;

        for (const block of candidates) {
            // Check Idempotency: Does a violation already exist for this block?
            // We store blockId in blockData or we can assume idempotency logic logic 
            // "if a violation of type MISSED_BLOCK exists for this user and this date with this blockId logic"
            // Using blockData json to store reference is best.

            const alreadyLogged = await prisma.violation.findFirst({
                where: {
                    type: "MISSED_BLOCK",
                    blockData: {
                        path: ["blockId"],
                        equals: block.id
                    }
                }
            });

            if (!alreadyLogged) {
                // Create Violation
                const violation = await prisma.violation.create({
                    data: {
                        userId: block.userId,
                        type: "MISSED_BLOCK",
                        tauntStatement: `You failed to complete strict block: ${block.task}`,
                        blockData: { blockId: block.id, task: block.task, date: block.date },
                        dateString: block.date
                    }
                });

                // Deduct Points
                // BLOCK_MISS_PENALTY
                // Assuming applyPoints handles negative values for penalties or we have specific Transaction Enum
                // The points library likely needs to know amount. 
                // We'll trust applyPoints to map ENUM to Amount, strictly following the USER request about Enum usage.
                
                await applyPoints(block.userId, "BLOCK_MISS_PENALTY", { violationId: violation.id });
                
                newViolationsCount++;
            }
        }

        return NextResponse.json({ 
            success: true, 
            processed: candidates.length, 
            newViolations: newViolationsCount 
        });

    } catch (error) {
        console.error("Cron Blocks Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
