import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const body = await req.json();
    const { note, tag, entryDate, context, mood } = body;

    // First check ownership
    const { id } = await params;

    // First check ownership
    const existing = await prisma.hourlyCheckin.findFirst({
        where: { id, userId: user.id }
    });
    if (!existing) return NextResponse.json({ error: "Entry not found" }, { status: 404 });

    const updated = await prisma.hourlyCheckin.update({
      where: { id },
      data: {
        note,
        tag,
        entryDate,
        context,
        mood: mood ? {
            upsert: {
                create: {
                    moodType: mood.moodType.toUpperCase(),
                    intensity: mood.intensity,
                    notes: mood.notes,
                    tags: mood.tags || [],
                    trigger: mood.trigger,
                    location: mood.location,
                    physicalState: mood.physicalState
                },
                update: {
                    moodType: mood.moodType.toUpperCase(),
                    intensity: mood.intensity,
                    notes: mood.notes,
                    tags: mood.tags || [],
                    trigger: mood.trigger,
                    location: mood.location,
                    physicalState: mood.physicalState
                }
            }
        } : undefined
      },
      include: { mood: true }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating timeline entry:", error);
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 });
  }
}
