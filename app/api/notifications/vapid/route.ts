
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    return NextResponse.json({ publicKey: process.env.WEBPUSH_PUBLIC_KEY });
}
