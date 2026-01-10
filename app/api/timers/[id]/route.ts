
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { TimerService } from "@/lib/services/timer.service";
import { UpdateTimerSchema } from "@/lib/validations";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  const { id } = await params;

  try {
     const body = await req.json();
     const { action } = UpdateTimerSchema.parse(body);
     
     if (action === 'reset') {
         const result = await TimerService.resetTimer(session.user.id, id);
         return NextResponse.json({ message: "RESET Timer OK", result });
     }

     return new NextResponse("Not Implemented general update", { status: 501 });

  } catch (error: any) {
    console.error(`[TIMER_${id}_PUT]`, error);
    if (error.name === 'ZodError') {
        return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
