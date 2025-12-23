import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { withSSO } from "./src/middlewares/sso";
import { chainMiddleware } from "@/lib/chain-middleware";

// Note: Next.js (Turbopack) requires a statically analyzable config object.
// Do not re-export a computed config; provide a literal here.

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle importadora authentication logic
  if (pathname.startsWith("/importadora")) {
    const pathParts = pathname.split("/").filter(Boolean);
    
    if (pathParts.length >= 2) {
      const importerId = pathParts[1];
      const isLoginPage = pathParts.length === 2;
      
      // Allow access to login page
      if (isLoginPage) {
        return NextResponse.next();
      }

      // Check authentication cookies
      const token = req.cookies.get("importer_access_token");
      const expiresAt = req.cookies.get("importer_expires_at");
      const cookieImporterId = req.cookies.get("importer_id");

      // Redirect to login if missing credentials
      if (!token || !expiresAt || !cookieImporterId) {
        return NextResponse.redirect(new URL(`/importadora/${importerId}`, req.url));
      }

      // Verify importerId matches
      if (cookieImporterId.value !== importerId) {
        const response = NextResponse.redirect(new URL(`/importadora/${importerId}`, req.url));
        response.cookies.delete("importer_access_token");
        response.cookies.delete("importer_id");
        response.cookies.delete("importer_expires_at");
        return response;
      }

      // Check token expiration
      const expiresAtNum = parseInt(expiresAt.value);
      if (Date.now() > expiresAtNum) {
        const response = NextResponse.redirect(
          new URL(`/importadora/${importerId}`, req.url)
        );
        response.cookies.delete("importer_access_token");
        response.cookies.delete("importer_id");
        response.cookies.delete("importer_expires_at");
        return response;
      }
    }
  }

  // Handle dashboard SSO authentication
  if (pathname.startsWith("/dashboard")) {
    const handler = chainMiddleware([withSSO]);
    const res = await handler(req, {} as any);
    return res instanceof NextResponse ? res : NextResponse.next();
  }

  return NextResponse.next();
}

// Protect dashboard and importadora paths
export const config = {
  matcher: ["/dashboard/:path*", "/importadora/:path*"],
};
