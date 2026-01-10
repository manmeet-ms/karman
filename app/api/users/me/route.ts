
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { UserService } from "@/lib/services/user.service";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const user = await UserService.getUserById(session.user.id);
    if (!user) {
        return new NextResponse("User not found", { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_ME_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
  
    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    try {
      const body = await req.json();
      // Remove sensitive fields if any, or validate using Zod
      // For now, implementing basic update
      const updatedUser = await UserService.updateUser(session.user.id, body);
      
      return NextResponse.json(updatedUser);
    } catch (error) {
      console.error("[USER_ME_PUT]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
