import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req:Request, res:Response) {
    const session =getServerSession()
    return NextResponse.json({backend_status:"Link is wokring" ,session:  session})
}  