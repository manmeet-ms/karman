
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params
    const { id } = await params;

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    try {
        const body = await req.json();
        const { enabled, interval, title } = body;

        // Verify ownership
        const existing = await prisma.reminder.findUnique({ where: { id } });
        if (!existing || existing.userId !== user.id) {
            return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
        }

        const updated = await prisma.reminder.update({
            where: { id },
            data: {
                enabled: enabled !== undefined ? enabled : existing.enabled,
                interval: interval ? parseInt(interval) : existing.interval,
                title: title || existing.title
            }
        });

        return NextResponse.json(updated);

    } catch (error) {
        console.error("Failed to update reminder", error);
        return NextResponse.json({ error: "Failed to update reminder" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

      // Await params
    const { id } = await params;

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    try {
        const existing = await prisma.reminder.findUnique({ where: { id } });
        if (!existing || existing.userId !== user.id) {
            return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
        }

        await prisma.reminder.delete({ where: { id } });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Failed to delete reminder", error);
        return NextResponse.json({ error: "Failed to delete reminder" }, { status: 500 });
    }
}
