
import { NextResponse } from "next/server";
import { PhilosophyService } from "@/lib/services/philosophy.service";

export async function GET(req: Request) {
    try {
        // Can be public
        const result = await PhilosophyService.getRandomQuoteAndLog();
        return NextResponse.json(result);
    } catch (error) {
         console.error("[PHILOSOPHY_RANDOM_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
