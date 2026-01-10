
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { UrgeService } from "@/lib/services/urge.service";
import { LogUrgeSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    const result = await UrgeService.getUrges(session.user.id, page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[URGES_GET]", error);
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
      const validatedData = LogUrgeSchema.parse(body);
      const result = await UrgeService.logUrge(session.user.id, validatedData);
      return NextResponse.json(result);
    } catch (error: any) {
      console.error("[URGES_POST]", error);
      if (error.name === 'ZodError') {
          return new NextResponse(JSON.stringify(error.errors), { status: 400 });
      }
      return new NextResponse("Internal Error", { status: 500 });
    }
}
