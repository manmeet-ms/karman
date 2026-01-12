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
    const body = await req.json();
    const { title, description, content, startDate } = body;

    // Check ownership
    const existing = await prisma.longtermModule.findFirst({
        where: { id, userId: user.id }
    });

    if (!existing) {
        return NextResponse.json({ error: "Module not found or unauthorized" }, { status: 404 });
    }

    const updated = await prisma.longtermModule.update({
      where: { id },
      data: {
        title,
        description,
        content,
        startDate
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating module:", error);
    return NextResponse.json({ error: "Failed to update module" }, { status: 500 });
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
      const existing = await prisma.longtermModule.findFirst({
          where: { id, userId: user.id }
      });
  
      if (!existing) {
          return NextResponse.json({ error: "Module not found or unauthorized" }, { status: 404 });
      }
  
      await prisma.longtermModule.delete({
        where: { id }
      });
  
      return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
      console.error("Error deleting module:", error);
      return NextResponse.json({ error: "Failed to delete module" }, { status: 500 });
    }
  }
