
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { TimerService } from "@/lib/services/timer.service";
import { CreateTimerSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const timers = await TimerService.getTimers(session.user.id);
    return NextResponse.json(timers);
  } catch (error) {
    console.error("[TIMERS_GET]", error);
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
      const validatedData = CreateTimerSchema.parse(body);
      const result = await TimerService.createTimer(session.user.id, validatedData);
      return NextResponse.json(result);
    } catch (error: any) {
      console.error("[TIMERS_POST]", error);
      if (error.name === 'ZodError') {
          return new NextResponse(JSON.stringify(error.errors), { status: 400 });
      }
      return new NextResponse("Internal Error", { status: 500 });
    }
}
