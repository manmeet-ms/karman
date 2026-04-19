import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, description, time, interval, enabled } = body;

        const reminder = await prisma.reminder.updateMany({
            where: {
                id: params.id,
                userId: session.user.id
            },
            data: {
                title,
                description,
                time,
                interval: parseInt(interval) || 0,
                enabled
            }
        });

        if (reminder.count === 0) return NextResponse.json({ error: "Reminder not found or unauthorized" }, { status: 404 });
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update reminder", error);
        return NextResponse.json({ error: "Failed to update reminder" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const deleted = await prisma.reminder.deleteMany({
            where: {
                id: params.id,
                userId: session.user.id
            }
        });

        if (deleted.count === 0) return NextResponse.json({ error: "Reminder not found or unauthorized" }, { status: 404 });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete reminder", error);
        return NextResponse.json({ error: "Failed to delete reminder" }, { status: 500 });
    }
}
