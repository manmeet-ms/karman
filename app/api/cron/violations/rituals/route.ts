
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import { applyPoints } from "@/lib/points";
import { sendNotificationToUser } from "@/lib/notifications";

export async function POST(req: NextRequest) {
    try {
        const yesterday = dayjs().subtract(1, 'day').format("YYYY-MM-DD");

        // Ideally iterate all users.
        // For scalability, we might chunk this, but for now fetch all.
        const users = await prisma.user.findMany({
            select: { id: true }
        });

        let newViolationsCount = 0;

        for (const user of users) {
             // Check if ritual exists for yesterday?
             // Actually, is a ritual mandatory every day?
             // "ritual miss (day passed away after 12 am and ritual is still not marked as complete)"
             // This implies filtering for rituals that WERE created but not completed? 
             // OR does it imply a ritual MUST be done every day?
             // The prompt says: "ritual miss (day passed away after 12 am and ritual is still not marked as complete)".
             // Usually, users SET a vow. If they set it but didn't complete it -> Violation.
             // If they didn't set it at all? Maybe that's also a violation or maybe just ignored.
             // Let's assume: If a Ritual entry exists for that date, but completed is false -> Violation.
             
             // Wait, if they forgot to even OPEN the app to set a vow?
             // The prompt says "ritual is still not marked as complete".
             // Let's check for EXISTENCE of a ritual record for yesterday that is INCOMPLETE.
             
             const ritual = await prisma.ritual.findFirst({
                 where: {
                     userId: user.id,
                     date: yesterday
                 }
             });
             
             if (ritual) {
                 if (!ritual.completedDailyCheckIn) {
                     // Violation candidate
                     const alreadyLogged = await prisma.violation.findFirst({
                        where: {
                            userId: user.id,
                            type: "MISSED_RITUAL",
                            dateString: yesterday
                        }
                    });

                    if (!alreadyLogged) {
                        const violation = await prisma.violation.create({
                            data: {
                                userId: user.id,
                                type: "MISSED_RITUAL",
                                tauntStatement: "You failed to complete your daily ritual.",
                                dateString: yesterday
                            }
                        });

                        await applyPoints(user.id, "RITUAL_MISS_PENALTY", { violationId: violation.id });
                        
                        await sendNotificationToUser(user.id, {
                            title: "Violation Logged",
                            body: "You failed to complete your daily ritual. Penalty applied."
                        }).catch(err => console.error("Push Error:", err));

                        newViolationsCount++;
                    }
                 }
             } else {
                 // No ritual set at all. Is this a violation?
                 // "Consistency is key".
                 // The prompt is slightly ambiguous: "ritual is still not marked as complete".
                 // If it doesn't exist, it definitely isn't marked as complete.
                 // But penalizing for not opening the app might be harsh unless "Daily Vow" is mandatory.
                 // Given the context of "Violations" and "Discipline", it likely IS mandatory to at least engage.
                 // However, without explicit instruction to penalize "No Vow Set", I will stick to "Vow Set but not Completed" as the safer interpretation of "ritual ... is not marked complete".
                 // Use comments to indicate this decision.
             }
        }

        return NextResponse.json({ 
            success: true, 
            processedUsers: users.length, 
            newViolations: newViolationsCount 
        });

    } catch (error) {
        console.error("Cron Rituals Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
