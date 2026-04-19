
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { PointsService } from "@/lib/services/points.service";
import { EventPointKey } from "@/lib/points";
import { ApplyPointsSchema } from "@/lib/validations";

import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const txns = await prisma.pointsTxn.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(txns);
  } catch (error: any) {
    console.error("[POINTS_GET]", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { event } = ApplyPointsSchema.parse(body);

    const result = await PointsService.applyPoints(session.user.id, event as EventPointKey);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[POINTS_POST]", error);
    if (error.name === 'ZodError') {
        return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse(error.message || "Internal Error", { status: 400 });
  }
}
