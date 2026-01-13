
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    try {
        const existing = await prisma.advice.findUnique({ where: { id } });
        if (!existing || existing.userId !== user.id) {
            return NextResponse.json({ error: "Advice not found or unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { content, tags } = body;

        const updated = await prisma.advice.update({
            where: { id },
            data: {
                content: content || existing.content,
                tags: tags || existing.tags
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Failed to update advice", error);
        return NextResponse.json({ error: "Failed to update advice" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    try {
        const existing = await prisma.advice.findUnique({ where: { id } });
        if (!existing || existing.userId !== user.id) {
            return NextResponse.json({ error: "Advice not found or unauthorized" }, { status: 403 });
        }

        await prisma.advice.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete advice", error);
        return NextResponse.json({ error: "Failed to delete advice" }, { status: 500 });
    }
}
