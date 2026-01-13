import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
 
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const tag = searchParams.get("tag");
        const mine = searchParams.get("mine");
        
        const where: any = {};

        if (tag && tag !== "ALL") {
            where.tags = { has: tag };
        }

        if (mine === "true") {
            const session = await getServerSession(authOptions);
            if (!session?.user?.email) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            const user = await prisma.user.findUnique({ where: { email: session.user.email } });
            if (user) {
                where.userId = user.id;
            }
        }

        const advice = await prisma.advice.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(advice);

    } catch (error) {
        console.error("Failed to fetch advice", error);
        return NextResponse.json({ error: "Failed to fetch advice" }, { status: 500 });
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
        const { content, tags } = body;

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const advice = await prisma.advice.create({
            data: {
                userId: user.id,
                content,
                tags: tags || ["OTHER"] // Default tag
            }
        });

        return NextResponse.json(advice);
    } catch (error) {
        console.error("Failed to create advice", error);
        return NextResponse.json({ error: "Failed to create advice" }, { status: 500 });
    }
}
