import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { RitualService } from "@/lib/services/ritual.service";
import { CreateRitualSchema } from "@/lib/validations";
import { applyPoints } from "@/lib/points";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const rituals = await RitualService.getRecentRituals(session.user.id);
    return NextResponse.json(rituals);
  } catch (error) {
    console.error("[RITUALS_GET]", error);
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
      const { vow } = CreateRitualSchema.parse(body);
      
      const ritual = await RitualService.checkInRitual(session.user.id, vow);
      return NextResponse.json(ritual, { status: 201 });
    } catch (error: any) {
      console.error("[RITUALS_POST]", error);
      if (error.name === 'ZodError') {
          return new NextResponse(JSON.stringify(error.errors), { status: 400 });
      }
      return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, action } = body;

        if (action === "complete" && id) {
            const ritual = await RitualService.completeRitual(id, session.user.id);
            try {
                await applyPoints(session.user.id, "RITUAL_COMPLETE_CREDIT", { ritualId: ritual.id });
            } catch (e) {
                console.error("Failed to award points for ritual", e);
            }
            return NextResponse.json(ritual);
        }

        return new NextResponse("Invalid action", { status: 400 });
    } catch (error) {
        console.error("[RITUALS_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
  
    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    try {
       await RitualService.flushRituals(session.user.id);
       return NextResponse.json({ message: true });
    } catch (error) {
      console.error("[RITUALS_DELETE]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
}
