
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { HourlyCheckinService } from "@/lib/services/hourly-checkin.service";
import { UpdateHourlyCheckinSchema } from "@/lib/validations";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  const { id } = await params;

  try {
     const body = await req.json();
     const validatedData = UpdateHourlyCheckinSchema.parse(body);
     const result = await HourlyCheckinService.updateCheckin(session.user.id, id, validatedData);
     return NextResponse.json(result);
  } catch (error: any) {
    console.error(`[HOURLY_CHECKIN_${id}_PUT]`, error);
    if (error.name === 'ZodError') {
        return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse(error.message || "Internal Error", { status: error.message === "Check-in not found" ? 404 : 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
  
    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const { id } = await params;
  
    try {
       await HourlyCheckinService.deleteCheckin(session.user.id, id);
       return NextResponse.json({ message: "Check-in deleted" });
    } catch (error: any) {
      console.error(`[HOURLY_CHECKIN_${id}_DELETE]`, error);
      return new NextResponse(error.message || "Internal Error", { status: error.message === "Check-in not found" ? 404 : 500 });
    }
}
