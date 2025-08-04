// GET para obtener la sesión
import { clearSession, getSession } from "@/auth-sso/services/server-actions";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (session.shouldClear) {
    await clearSession();
  }
  return NextResponse.json(session);
}
