
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { PhilosophyService } from "@/lib/services/philosophy.service";
import { CreatePhilosophyQuoteSchema } from "@/lib/validations";

export async function GET(req: Request) {
    const quotes = await PhilosophyService.getQuotes();
    return NextResponse.json(quotes);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();
        const validatedData = CreatePhilosophyQuoteSchema.parse(body);
        const result = await PhilosophyService.createQuote(validatedData);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("[PHILOSOPHY_POST]", error);
        if (error.name === 'ZodError') {
            return new NextResponse(JSON.stringify(error.errors), { status: 400 });
        }
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    
    try {
        const result = await PhilosophyService.flushQuotes();
        return NextResponse.json(result);
    } catch (error) {
         console.error("[PHILOSOPHY_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
