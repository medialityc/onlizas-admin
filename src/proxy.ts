import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getLoginUrl, getServerSession } from "zas-sso-client";


function isProtected(pathname: string, protectedRoutes: string[] | null) {
  if (!protectedRoutes) return true;
  return protectedRoutes.some((prefix) => {
    if (!prefix) return false;
    if (prefix === "/") return true;
    return pathname === prefix || pathname.startsWith(prefix + "/");
  });
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle importadora authentication logic
  if (pathname.startsWith("/importadora")) {
 
    if (pathname === "/importadora/login" || pathname === "/importadora") {
      return NextResponse.next();
    }

    const token = req.cookies.get("importer_access_token");
    const expiresAt = req.cookies.get("importer_expires_at");

    if (!token || !expiresAt) {
      return NextResponse.redirect(new URL("/importadora/login", req.url));
    }


    const expiresAtNum = parseInt(expiresAt.value);
    if (Date.now() > expiresAtNum) {
      const response = NextResponse.redirect(
        new URL("/importadora/login", req.url)
      );
      response.cookies.delete("importer_access_token");
      response.cookies.delete("importer_id");
      response.cookies.delete("importer_expires_at");
      return response;
    }
  }

  if (pathname.startsWith("/dashboard")) {
    const protectedRoutes = ["/dashboard"];
    if (!isProtected(pathname, protectedRoutes)) {
      return NextResponse.next();
    }

    let hasSession = false;
    try {
      const session = await getServerSession();
      hasSession =
        !!session?.user &&
        !!session?.tokens?.accessToken &&
        !!session?.tokens?.refreshToken;
    } catch {}

    if (hasSession) return NextResponse.next();

    const loginUrl = new URL(getLoginUrl());
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/importadora/:path*"],
};
