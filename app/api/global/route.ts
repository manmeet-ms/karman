import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { GlobalPostType } from "@/generated/prisma/enums";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");
        const mine = searchParams.get("mine");
        
        const where: any = {};

        if (type && type !== "ALL") {
            where.type = type;
        }

        if (mine === "true") {
            const session = await getServerSession(authOptions);
            if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            const user = await prisma.user.findUnique({ where: { email: session.user.email } });
            if (user) where.userId = user.id;
        }

        const posts = await prisma.globalPost.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, image: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    try {
        const body = await req.json();
        const { content, type } = body;

        if (!content || !type) {
            return NextResponse.json({ error: "Content and type are required" }, { status: 400 });
        }

        const post = await prisma.globalPost.create({
            data: {
                userId: user.id,
                content,
                type: type as GlobalPostType
            }
        });

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
