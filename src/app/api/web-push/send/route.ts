import webpush from "web-push";
import { NextRequest, NextResponse } from "next/server";
import { subscriptions } from "@/lib/push-subscriptions";
import { ensureVapidDetails } from "@/lib/web-push";

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
    ensureVapidDetails();
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
