import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/importadora")) {

    if (pathname === "/importadora/login" || pathname === "/importadora") {
      return NextResponse.next();
    }

    const token = request.cookies.get("importer_access_token");
    const expiresAt = request.cookies.get("importer_expires_at");

    if (!token || !expiresAt) {
      return NextResponse.redirect(new URL("/importadora/login", request.url));
    }

    const expiresAtNum = parseInt(expiresAt.value);
    if (Date.now() > expiresAtNum) {
      const response = NextResponse.redirect(
        new URL("/importadora/login", request.url)
      );
      response.cookies.delete("importer_access_token");
      response.cookies.delete("importer_id");
      response.cookies.delete("importer_expires_at");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/importadora/:path*"],
};
