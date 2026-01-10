
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { UrgeService } from "@/lib/services/urge.service";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const { id } = await params;

    try {
        const result = await UrgeService.resolveUrge(session.user.id, id);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("[URGE_RESOLVE]", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
