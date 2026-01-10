
import { NextResponse } from "next/server";
import { NotificationService } from "@/lib/services/notification.service";
import { SaveSubscriptionSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { endpoint, keys } = SaveSubscriptionSchema.parse(body);
    
    const result = await NotificationService.saveSubscription(endpoint, keys);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("[NOTIF_SUBSCRIBE_POST]", error);
    if (error.name === 'ZodError') {
        return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
