import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/importadora")) {
    const pathParts = pathname.split("/").filter(Boolean);
    
    if (pathParts.length >= 2) {
      const importerId = pathParts[1];
      const isLoginPage = pathParts.length === 2;
      
      if (isLoginPage) {
        return NextResponse.next();
      }

      const token = request.cookies.get("importer_access_token");
      const expiresAt = request.cookies.get("importer_expires_at");
      const cookieImporterId = request.cookies.get("importer_id");

      if (!token || !expiresAt || !cookieImporterId) {
        return NextResponse.redirect(new URL(`/importadora/${importerId}`, request.url));
      }

      if (cookieImporterId.value !== importerId) {
        const response = NextResponse.redirect(new URL(`/importadora/${importerId}`, request.url));
        response.cookies.delete("importer_access_token");
        response.cookies.delete("importer_id");
        response.cookies.delete("importer_expires_at");
        return response;
      }

      const expiresAtNum = parseInt(expiresAt.value);
      if (Date.now() > expiresAtNum) {
        const response = NextResponse.redirect(
          new URL(`/importadora/${importerId}`, request.url)
        );
        response.cookies.delete("importer_access_token");
        response.cookies.delete("importer_id");
        response.cookies.delete("importer_expires_at");
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/importadora/:path*"],
};
