import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const body = await req.json();
    const { title, content, tags, date } = body;

    const existing = await prisma.diary.findUnique({
        where: { id: params.id, userId: user.id }
    });
    if (!existing) return NextResponse.json({ error: "Entry not found" }, { status: 404 });

    const updated = await prisma.diary.update({
      where: { id: params.id },
      data: {
        title,
        content,
        tags,
        date
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating diary entry:", error);
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  
    try {
      const existing = await prisma.diary.findUnique({
          where: { id: params.id, userId: user.id }
      });
      if (!existing) return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  
      await prisma.diary.delete({
        where: { id: params.id }
      });
  
      return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
      console.error("Error deleting diary entry:", error);
      return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
    }
}
