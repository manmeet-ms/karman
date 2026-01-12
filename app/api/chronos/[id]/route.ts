
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { applyPoints } from "@/lib/points";

// ...

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    try {
        await prisma.timer.delete({
            where: {
                id: id,
                userId: user.id
            }
        });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}

// Handling reset or update
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    try {
        const body = await req.json();
        const { action, ...data } = body;

        if (action === "RESET") {
             const updated = await prisma.timer.update({
                where: { id: id, userId: user.id },
                data: {
                    timerStarted: new Date().toISOString(),
                    failures: {
                        increment: 1
                    }
                }
             });

             try {
                await applyPoints(user.id, "TIMER_RESET_PENALTY", { timerId: id });
             } catch {
                // ignore
             }

             return NextResponse.json(updated);
        } else {
             // Normal update
             const updated = await prisma.timer.update({
                where: { id: id, userId: user.id },
                data: data
             });
             return NextResponse.json(updated);
        }
    } catch {
         return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
