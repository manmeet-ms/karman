
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AgreementCategory } from "@/generated/prisma/enums";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const items = await prisma.agreementItem.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch agreement items" }, { status: 500 });
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
    const { category, bulkText } = body;

    if (!category || !Object.values(AgreementCategory).includes(category)) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    if (typeof bulkText !== 'string') {
        return NextResponse.json({ error: "Invalid text format" }, { status: 400 });
    }

    // 1. Delete existing items for this category
    await prisma.agreementItem.deleteMany({
        where: {
            userId: user.id,
            category: category
        }
    });

    // 2. Parse and Create new items
    const lines = bulkText.split('\n');
    const itemsToCreate = [];

    for (const line of lines) {
        const cleanLine = line.trim();
        if (!cleanLine) continue;

        itemsToCreate.push({
            userId: user.id,
            category: category,
            content: cleanLine
        });
    }

    if (itemsToCreate.length > 0) {
        await prisma.agreementItem.createMany({
            data: itemsToCreate
        });
    }

    return NextResponse.json({ message: "Updated successfully", count: itemsToCreate.length });

  } catch (error) {
    console.error("Error updating agreements:", error);
    return NextResponse.json({ error: "Failed to update agreements" }, { status: 500 });
  }
}
