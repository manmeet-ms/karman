import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendNotificationToUser } from "@/lib/notifications";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    try {
        const result = await sendNotificationToUser(user.id, {
            title: "Test Notification",
            body: "This is a test notification from Karman.",
        });
        
        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error("Test Notification Error:", error);
        return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }
}
