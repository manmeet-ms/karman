import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = getServerSession()
    return NextResponse.json({ backend_status: "Backend is up and running", session: session })
}  