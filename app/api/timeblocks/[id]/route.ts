
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { TimeblockService } from "@/lib/services/timeblock.service";
import { UpdateTimeblockSchema } from "@/lib/validations";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  const { id } = await params;

  try {
     const body = await req.json();
     const validatedData = UpdateTimeblockSchema.parse(body);
     
     if (validatedData.completed !== undefined) {
         if (validatedData.completed) {
             const result = await TimeblockService.completeBlock(session.user.id, id);
             return NextResponse.json(result);
         }
         // Handle un-complete? Logic not in service yet.
     }
     
     // General update logic here if service supports it
     // For now only complete is supported fully via service `completeBlock`.
     // Should implement general update in service if needed.
     
     return new NextResponse("Only completion update fully implemented", { status: 501 });
  } catch (error: any) {
    console.error(`[TIMEBLOCK_${id}_PUT]`, error);
    if (error.name === 'ZodError') {
        return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
