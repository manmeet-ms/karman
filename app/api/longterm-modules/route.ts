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

  const modules = await prisma.longtermModule.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(modules);
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
    const { title, description, content, startDate } = body;

    const module = await prisma.longtermModule.create({
      data: {
        userId: user.id,
        title,
        description,
        content,
        startDate
      }
    });

    return NextResponse.json(module);
  } catch (error) {
    console.error("Error creating module:", error);
    return NextResponse.json({ error: "Failed to create module" }, { status: 500 });
  }
}
