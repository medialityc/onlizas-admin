import { clearSession } from "@/auth-sso/services/server-actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await clearSession();
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get("redirect") || "/login";

  // Construir nueva URL con los parámetros originales (excepto 'redirect')
  const params = new URLSearchParams(searchParams);
  params.delete("redirect");
  const queryString = params.toString();
  const finalRedirect =
    queryString.length > 0 ? `${redirectTo}?${queryString}` : redirectTo;

  return NextResponse.redirect(finalRedirect);
}
