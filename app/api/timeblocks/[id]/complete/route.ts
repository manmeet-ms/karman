
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Next.js 15 might require awaiting params if using newer versions, strictly follow standard route handler pattern.
  // Assuming standard App Router where params is available.
  const id = params.id;

  try {
    const block = await prisma.timeBlock.update({
      where: { id: id },
      data: { completed: true },
    });
    return NextResponse.json(block);
  } catch {
    return NextResponse.json({ error: "Failed to update block" }, { status: 500 });
  }
}
