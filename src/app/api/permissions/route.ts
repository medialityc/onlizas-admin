import { getUserPermissions, isAdmin } from "@/auth-sso/permissions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const permissions = await getUserPermissions();
    const userIsAdmin = await isAdmin();
    
    return NextResponse.json({
      permissions,
      isAdmin: userIsAdmin
    });
  } catch (error) {
    console.error("Error in permissions API:", error);
    return NextResponse.json({ permissions: [], isAdmin: false }, { status: 500 });
  }
}