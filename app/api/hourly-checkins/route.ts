
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { HourlyCheckinService } from "@/lib/services/hourly-checkin.service";
import { CreateHourlyCheckinSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const checkins = await HourlyCheckinService.getTodayCheckins(session.user.id);
    return NextResponse.json(checkins);
  } catch (error) {
    console.error("[HOURLY_CHECKINS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    try {
      const body = await req.json();
      const validatedData = CreateHourlyCheckinSchema.parse(body);
      const result = await HourlyCheckinService.createCheckin(session.user.id, validatedData);
      return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
      console.error("[HOURLY_CHECKINS_POST]", error);
      if (error.name === 'ZodError') {
          return new NextResponse(JSON.stringify(error.errors), { status: 400 });
      }
      return new NextResponse("Internal Error", { status: 500 });
    }
}
