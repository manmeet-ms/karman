
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const DEFAULT_REMINDERS = [
    { title: "Work Session", type: "WORK", interval: 120, enabled: true },
    { title: "Philosophy Quote", type: "PHILOSOPHY", interval: 120, enabled: true },
    { title: "Prolonged Sitting", description: "Stand up and stretch for 5 minutes.", type: "SITTING", interval: 40, enabled: true },
    { title: "Drink Water", description: "Stay hydrated.", type: "WATER", interval: 60, enabled: true },
];

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    try {
        let reminders = await prisma.reminder.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'asc' }
        });

        if (reminders.length === 0) {
            // Lazy seed defaults
            const creationPromises = DEFAULT_REMINDERS.map(def => 
                prisma.reminder.create({
                    data: {
                        userId: user.id,
                        ...def
                    }
                })
            );
            reminders = await Promise.all(creationPromises);
        }

        return NextResponse.json(reminders);
    } catch (error) {
        console.error("Failed to fetch reminders", error);
        return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    try {
        const body = await req.json();
        const { title, description, time, interval, enabled = true } = body;

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const reminder = await prisma.reminder.create({
            data: {
                userId: user.id,
                title,
                description,
                time,
                type: "CUSTOM",
                interval: parseInt(interval) || 0,
                enabled
            }
        });

        return NextResponse.json(reminder);
    } catch (error) {
        console.error("Failed to create reminder", error);
        return NextResponse.json({ error: "Failed to create reminder" }, { status: 500 });
    }
}
