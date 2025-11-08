import { NextRequest, NextResponse } from "next/server";
import { backendRoutes } from "@/lib/endpoint";
import { getClientIp, rateLimit, sanitizeReviewPayload } from "../../_utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ActionBody {
  action: "APPROVE" | "REJECT" | "COMMENT";
  comment?: string;
  reviewerEmail?: string;
  reviewerName?: string;
}

// POST /api/external-review/[token]/action -> proxy a backend POST /external-review/{token}/action
export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;
  const ip = getClientIp(req.headers);
  const limit = rateLimit(ip);
  if (!limit.allowed) return limit.response!; // 429

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  try {
    const body = (await req.json()) as ActionBody;
    const { action, comment, reviewerEmail, reviewerName } = body;

    if (!action || !["APPROVE", "REJECT", "COMMENT"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const backendResp = await fetch(
      backendRoutes.externalReview.actionByToken(token),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, comment, reviewerEmail, reviewerName }),
        cache: "no-store",
      }
    );

    if (!backendResp.ok) {
      return new NextResponse(null, { status: backendResp.status });
    }

    const data = await backendResp.json().catch(() => ({ status: "OK" }));
    return NextResponse.json(sanitizeReviewPayload(data), { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
