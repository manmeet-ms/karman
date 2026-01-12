import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const people = await prisma.person.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(people);
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
    const { bulkText, name, relation, notes } = body;

    if (bulkText) {
        const lines = (bulkText as string).split('\n').filter(l => l.trim() !== '');
        const created = [];

        for (const line of lines) {
            const parts = line.split(',').map(s => s.trim());
            if (parts.length > 0) {
                const pName = parts[0];
                if (!pName) continue;
                
                const pRelation = parts[1] || null;
                // Notes could be the rest combined
                const pNotes = parts.slice(2).join(', ') || null;

                const person = await prisma.person.create({
                    data: {
                        userId: user.id,
                        name: pName,
                        relation: pRelation,
                        notes: pNotes
                    }
                });
                created.push(person);
            }
        }
        return NextResponse.json(created);
    } else {
        if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

        const person = await prisma.person.create({
            data: {
                userId: user.id,
                name,
                relation,
                notes
            }
        });
        return NextResponse.json(person);
    }
  } catch (error) {
    console.error("Error creating person:", error);
    return NextResponse.json({ error: "Failed to create person" }, { status: 500 });
  }
}
