
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { ViolationService } from "@/lib/services/violation.service";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const { id } = await params;

    try {
        // Legacy: resolveViolationSrv => api.post(`/violations/${id}/resolve`)
        // Legacy controller: resolveViolation => findByIdAndDelete
        const result = await ViolationService.resolveViolation(session.user.id, id);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("[VIOLATION_RESOLVE]", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
