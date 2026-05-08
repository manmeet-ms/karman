import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    try {
        const body = await req.json();
        const { reason } = body;

        const existing = await prisma.violation.findUnique({ where: { id } });
        if (!existing || existing.userId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 403 });

        const updated = await prisma.violation.update({
            where: { id },
            data: {
                reason,
                resolved: true
            }
        });

        return NextResponse.json(updated);
    } catch (e) {
        return NextResponse.json({ error: "Failed to update violation" }, { status: 500 });
    }
}
