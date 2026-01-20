import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendRoutes } from "@/lib/endpoint";

const IMPORTER_TOKEN_COOKIE = "importer_access_token";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(IMPORTER_TOKEN_COOKIE)?.value;

    if (!token) {
      return NextResponse.json(
        { error: true, message: "No autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    if (!reason?.trim()) {
      return NextResponse.json(
        { error: true, message: "El motivo del rechazo es requerido" },
        { status: 400 }
      );
    }

    const response = await fetch(
      backendRoutes.importerAccess.rejectContract(id),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Importer-Session-Token": token,
        },
        body: JSON.stringify({ reason }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: true,
          message: data.message || "Error al rechazar contrato",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: data.message || "Contrato rechazado",
    });
  } catch (error) {
    console.error("Error al rechazar contrato:", error);
    return NextResponse.json(
      { error: true, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
