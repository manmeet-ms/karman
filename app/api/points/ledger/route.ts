
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { PointsService } from "@/lib/services/points.service";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
     return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const ledger = await PointsService.getLedger(session.user.id);
    const totalEntries = ledger.length; 
    return NextResponse.json({ totalEntries, entries: ledger });
  } catch (error) {
    console.error("[POINTS_LEDGER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
