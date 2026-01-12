import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const timeline = await prisma.hourlyCheckin.findMany({
    where: { userId: user.id },
    include: { mood: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(timeline);
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
    const { note, tag, entryDate, context, mood } = body;

    const checkin = await prisma.hourlyCheckin.create({
      data: {
        userId: user.id,
        note,
        tag,
        entryDate,
        context,
        mood: mood ? {
            create: {
                moodType: mood.moodType,
                intensity: mood.intensity,
                notes: mood.notes,
                tags: mood.tags || [],
                trigger: mood.trigger,
                location: mood.location,
                physicalState: mood.physicalState
            }
        } : undefined
      },
      include: { mood: true }
    });

    return NextResponse.json(checkin);
  } catch (error) {
    console.error("Error creating timeline entry:", error);
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
  }
}
