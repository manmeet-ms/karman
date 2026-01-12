import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { applyPoints } from "@/lib/points";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const violations = await prisma.violation.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    return NextResponse.json(violations);
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
    const { type, tauntStatement, blockData } = body; // type should be one of ViolationTypeEnum

    const violation = await prisma.violation.create({
      data: {
        userId: user.id,
        type: type || "MISSED_BLOCK", // Default or validation
        tauntStatement,
        blockData: blockData || {},
        dateString: new Date().toISOString().split('T')[0]
      }
    });

    // Apply Penalty
    try {
        await applyPoints(user.id, "VIOLATION_PENALTY", { violationId: violation.id });
    } catch {
        // ignore
    }

    return NextResponse.json(violation);
  } catch (error) {
    console.error("Error creating violation:", error);
    return NextResponse.json({ error: "Failed to create violation" }, { status: 500 });
  }
}
