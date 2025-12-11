import { NextRequest, NextResponse } from "next/server";
import { getLoginUrl, getServerSession, SSOInitOptions } from "zas-sso-client";

/** Verifica si un pathname está dentro de las rutas protegidas */
function isProtected(pathname: string, protectedRoutes: string[] | null) {
  if (!protectedRoutes) return true;
  return protectedRoutes.some((prefix) => {
    if (!prefix) return false;
    if (prefix === "/") return true;
    return pathname === prefix || pathname.startsWith(prefix + "/");
  });
}

/** Construye el config del middleware */
export function buildMiddlewareConfig(routes?: string[]) {
  if (!routes || routes.length === 0) {
    return { matcher: ["/(.*)"] };
  }

  const matcher = Array.from(new Set(routes)).map((r) => {
    const cleaned = r.endsWith("/") ? r.slice(0, -1) : r;
    return cleaned === "/" ? "/:path*" : `${cleaned}/:path*`;
  });

  return { matcher };
}

/** Crea el middleware SSO */
export default function createSSOMiddleware(options?: SSOInitOptions) {
  const protectedRoutes = options?.protectedRoutes?.length
    ? options.protectedRoutes
    : null;

  return async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

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
  };
}
