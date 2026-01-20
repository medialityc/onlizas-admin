import { NextRequest, NextResponse } from "next/server";
import { backendRoutes } from "@/lib/endpoint";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Obtener token de la cookie de sesión del importador
    const token = request.cookies.get("importer_access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: true, message: "No autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const response = await fetch(
      `${backendRoutes.importerAccess.contracts}/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Importer-Session-Token": token,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: true,
          message: data?.message || "Error al actualizar el contrato",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: data?.message || "Contrato actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar contrato:", error);
    return NextResponse.json(
      { error: true, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
