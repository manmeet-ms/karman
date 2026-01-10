
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { PointsService } from "@/lib/services/points.service";
import { EventPointKey } from "@/lib/points";
import { ApplyPointsSchema } from "@/lib/validations";

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
