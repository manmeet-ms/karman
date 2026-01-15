
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const subscription = await req.json();
        
        if (!subscription.endpoint || !subscription.keys) {
            return NextResponse.json({ error: "Invalid subscription payload" }, { status: 400 });
        }

        // Upsert subscription
        await prisma.pushSubscription.upsert({
            where: { endpoint: subscription.endpoint },
            update: {
                user: { connect: { id: session.user.id } },
                keys: subscription.keys ?? undefined,
            },
            create: {
                user: { connect: { id: session.user.id } },
                endpoint: subscription.endpoint,
                keys: subscription.keys ?? undefined,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Subscription error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
