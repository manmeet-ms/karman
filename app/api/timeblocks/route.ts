
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const today = dayjs().format("YYYY-MM-DD");

  try {
    const blocks = await prisma.timeBlock.findMany({
      where: {
        userId: user.id,
        date: today,
      },
      orderBy: {
        startTime: "asc",
      },
    });
    return NextResponse.json(blocks);
  } catch {
    return NextResponse.json({ error: "Failed to fetch blocks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const body = await req.json();
    const { bulkText } = body; 

    if (!bulkText || typeof bulkText !== 'string') {
        return NextResponse.json({ error: "Invalid input format" }, { status: 400 });
    }

    const today = dayjs().format("YYYY-MM-DD");
    const lines = bulkText.split('\n');
    const blocksToCreate = [];

    // format: // task, description, isStrict, startTime(HH:mm), endTime(HH:mm)
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        // Remove leading '//' if present.
        const cleanLine = trimmedLine.replace(/^\/\/\s*/, '');
        
        const parts = cleanLine.split(';').map(p => p.trim());
        
        if (parts.length >= 5) {
            const [task, description, isStrictStr, startTime, endTime] = parts;

            if (!task || !startTime || !endTime) continue;
            
            blocksToCreate.push({
                userId: user.id,
                task,
                description: description || "",
                strict: isStrictStr.toLowerCase() === 'true',
                startTime,
                endTime,
                date: today,
                completed: false
            });
        }
    }

    if (blocksToCreate.length === 0) {
        return NextResponse.json({ message: "No valid blocks found to create" }, { status: 400 });
    }
const timeblockClearingResult=await prisma.timeBlock.deleteMany({where:{userId:equa}})
    if (timeblockClearingResult){
    const result = await prisma.timeBlock.createMany({
        data: blocksToCreate
    });}

    return NextResponse.json({ message: "Timeblocks created", count: result.count });

  } catch (error) {
    console.error("Error creating timeblocks:", error);
    return NextResponse.json({ error: "Failed to create blocks" }, { status: 500 });
  }
}
