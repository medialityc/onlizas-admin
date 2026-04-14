import webpush from "web-push";
import { NextRequest, NextResponse } from "next/server";
import { subscriptions } from "@/lib/push-subscriptions";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription, userId } = body as {
      subscription: webpush.PushSubscription;
      userId?: string;
    };

    if (!subscription?.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription" },
        { status: 400 },
      );
    }

    const key = userId && userId !== "" ? userId : subscription.endpoint;
    subscriptions.set(key, subscription);
    return NextResponse.json({ message: "Subscription saved." });
  } catch {
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body as { userId?: string };
    if (userId) subscriptions.delete(userId);
    return NextResponse.json({ message: "Subscription removed." });
  } catch {
    return NextResponse.json(
      { error: "Failed to remove subscription" },
      { status: 500 },
    );
  }
}
