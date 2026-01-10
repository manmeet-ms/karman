
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { UserService } from "@/lib/services/user.service";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  const { id } = await params;

  try {
    const user = await UserService.getUserById(id);
    if (!user) {
        return new NextResponse("User not found", { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(`[USER_${id}_GET]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
