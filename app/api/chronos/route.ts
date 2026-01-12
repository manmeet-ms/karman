
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const timers = await prisma.timer.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(timers);
  } catch {
    return NextResponse.json({ error: "Failed to fetch timers" }, { status: 500 });
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
      const { codename, title, description, perks, punishments, alternates } = body;
      
      const timer = await prisma.timer.create({
        data: {
          userId: user.id,
          codename,
          title,
          description,
          timerStarted: new Date().toISOString(),
          perks: perks || [], 
          punishments: punishments || [],
          alternates: alternates || [],
          failures: 0
        }
      });
  
      return NextResponse.json(timer);
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: "Failed to create timer" }, { status: 500 });
    }
}
