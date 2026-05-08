import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const posts = await prisma.globalPost.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        username: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Failed to fetch global posts", error);
        return NextResponse.json({ error: "Failed to fetch top posts" }, { status: 500 });
    }
}
