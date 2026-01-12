
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const leaderboard = await prisma.user.findMany({
      orderBy: {
        points: "desc",
      },
      take: 50,
      select: {
        id: true,
        name: true,
        image: true,
        points: true,
        role: true,
      },
    });
    return NextResponse.json(leaderboard);
  } catch {
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
