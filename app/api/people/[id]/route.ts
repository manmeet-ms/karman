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
    const { name, relation, notes } = body;

    const { id } = await params;

    const existing = await prisma.person.findFirst({
        where: { id, userId: user.id }
    });

    if (!existing) {
        return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    const updated = await prisma.person.update({
      where: { id },
      data: {
        name,
        relation,
        notes
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating person:", error);
    return NextResponse.json({ error: "Failed to update person" }, { status: 500 });
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
      const { id } = await params;
      const existing = await prisma.person.findFirst({
          where: { id, userId: user.id }
      });
  
      if (!existing) {
          return NextResponse.json({ error: "Person not found" }, { status: 404 });
      }
  
      await prisma.person.delete({
        where: { id }
      });
  
      return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
      console.error("Error deleting person:", error);
      return NextResponse.json({ error: "Failed to delete person" }, { status: 500 });
    }
  }
