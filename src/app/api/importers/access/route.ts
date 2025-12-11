import { NextRequest, NextResponse } from "next/server";
import { backendRoutes } from "@/lib/endpoint";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: true, message: "Código inválido" },
        { status: 400 }
      );
    }

    const res = await fetch(backendRoutes.importers.access, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: true, message: data.message || "Código inválido o expirado" },
        { status: res.status }
      );
    }

    return NextResponse.json({
      token: data.token,
      expiresIn: data.expiresIn || 3600,
      importer: data.importer,
    });
  } catch (error) {
    console.error("Error in importer access:", error);
    return NextResponse.json(
      { error: true, message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
