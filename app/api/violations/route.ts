
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { ViolationService } from "@/lib/services/violation.service";
import { LogViolationSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const violations = await ViolationService.getViolations(session.user.id);
    return NextResponse.json(violations);
  } catch (error) {
    console.error("[VIOLATIONS_GET]", error);
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
      const { type, timeBlockId } = LogViolationSchema.parse(body);
      
      const violation = await ViolationService.logViolation(session.user.id, type, timeBlockId);
      return NextResponse.json(violation, { status: 201 });
    } catch (error: any) {
      console.error("[VIOLATIONS_POST]", error);
      if (error.name === 'ZodError') {
          return new NextResponse(JSON.stringify(error.errors), { status: 400 });
      }
      return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
      
    if (!session || !session.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        await ViolationService.flushViolations(session.user.id);
        return NextResponse.json({ message: true });
    } catch (error) {
        console.error("[VIOLATIONS_FLUSH]", error);
         return new NextResponse("Internal Error", { status: 500 });
    }
}
