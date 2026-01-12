
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { applyPoints } from "@/lib/points";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Next.js 15 might require awaiting params if using newer versions, strictly follow standard route handler pattern.
  const { id: blockId } = await params;

  try {
    const block = await prisma.timeBlock.update({
      where: { id:  blockId },
      data: { completed: true },
    });

    try {
        await applyPoints(block.userId, "TIMEBLOCK_COMPLETE_CREDIT", { blockId: block.id });
    } catch {
       // ignore
    }

    return NextResponse.json(block);
  } catch (error){
    console.log(error);
    return NextResponse.json({ error: "Failed to update block" }, { status: 500 });
  }
}
