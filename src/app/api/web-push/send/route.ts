import webpush from "web-push";
import { NextRequest, NextResponse } from "next/server";
import { subscriptions } from "@/lib/push-subscriptions";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  badge?: string;
  tag?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, payload } = body as {
      userId?: string;
      payload: PushPayload;
    };

    const pushPayload = JSON.stringify(payload);

    if (userId) {
      const sub = subscriptions.get(userId);
      if (!sub) {
        return NextResponse.json(
          { error: "No subscription for user" },
          { status: 404 },
        );
      }
      await webpush.sendNotification(sub, pushPayload);
    } else {
      await Promise.allSettled(
        Array.from(subscriptions.values()).map((sub) =>
          webpush.sendNotification(sub, pushPayload),
        ),
      );
    }

    return NextResponse.json({ message: "Push sent." });
  } catch {
    return NextResponse.json({ error: "Failed to send push" }, { status: 500 });
  }
}
