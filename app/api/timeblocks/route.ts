
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { TimeblockService } from "@/lib/services/timeblock.service";
import { CreateTimeblockSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const blocks = await TimeblockService.getTodayBlocks(session.user.id);
    return NextResponse.json(blocks);
  } catch (error) {
    console.error("[TIMEBLOCKS_GET]", error);
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
      
      // Check if it's an init request (action: 'init' is not in schema, handling separately)
      if (body.action === 'init') {
        const result = await TimeblockService.initTimeblocks(session.user.id);
        return NextResponse.json(result, { status: 201 });
      }

      // Else create block
      const validatedData = CreateTimeblockSchema.parse(body);
      const result = await TimeblockService.createTimeBlock(session.user.id, validatedData);
      return NextResponse.json(result, { status: 201 });

    } catch (error: any) {
      console.error("[TIMEBLOCKS_POST]", error);
      if (error.name === 'ZodError') {
         return new NextResponse(JSON.stringify(error.errors), { status: 400 });
      }
      return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        await TimeblockService.flushBlocks(session.user.id);
        return NextResponse.json({ message: "Timeblocks flushed" });
    } catch (error) {
        console.error("[TIMEBLOCKS_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
