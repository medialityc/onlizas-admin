import { NextRequest, NextResponse } from "next/server";
import { backendRoutes } from "@/lib/endpoint";
import { getClientIp, rateLimit, sanitizeReviewPayload } from "../_utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/external-review/[token] -> proxy a backend GET /external-review/{token}
export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;
  const ip = getClientIp(_req.headers);
  const limit = rateLimit(ip);
  if (!limit.allowed) return limit.response!; // 429

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  try {
    const resp = await fetch(backendRoutes.externalReview.getByToken(token), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!resp.ok) {
      // 404 -> NOT_FOUND / other statuses propagate
      return new NextResponse(null, { status: resp.status });
    }

    const data = await resp.json();
    return NextResponse.json(sanitizeReviewPayload(data), { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
