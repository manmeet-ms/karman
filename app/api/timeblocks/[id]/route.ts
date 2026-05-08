
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { TimeblockService } from "@/lib/services/timeblock.service";
import { UpdateTimeblockSchema } from "@/lib/validations";
import prisma from "@/lib/prisma";

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
     }
     
     // General update
     const existing = await prisma.timeBlock.findUnique({ where: { id } });
     if (!existing || existing.userId !== session.user.id) {
         return new NextResponse("Not found or unauthorized", { status: 403 });
     }
     
     const updated = await prisma.timeBlock.update({
         where: { id },
         data: {
             task: body.task !== undefined ? body.task : existing.task,
             description: body.description !== undefined ? body.description : existing.description,
             startTime: body.startTime !== undefined ? body.startTime : existing.startTime,
             endTime: body.endTime !== undefined ? body.endTime : existing.endTime,
             strict: body.strict !== undefined ? body.strict : existing.strict,
         }
     });
     return NextResponse.json(updated);
  } catch (error: any) {
    console.error(`[TIMEBLOCK_${id}_PUT]`, error);
    if (error.name === 'ZodError') {
        return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  const { id } = await params;

  try {
     const existing = await prisma.timeBlock.findUnique({ where: { id } });
     if (!existing || existing.userId !== session.user.id) {
         return new NextResponse("Not found or unauthorized", { status: 403 });
     }
     
     await prisma.timeBlock.delete({ where: { id } });
     return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`[TIMEBLOCK_${id}_DELETE]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
