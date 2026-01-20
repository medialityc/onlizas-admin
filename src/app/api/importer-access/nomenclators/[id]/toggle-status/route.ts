import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("importer_access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: true, message: "No autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}importer-access/nomenclators/${id}/toggle-status`,
      {
        method: "PATCH",
        headers: {
          "X-Importer-Session-Token": token,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: true, message: errorData.message || "Error al cambiar estado del nomenclador" },
        { status: response.status }
      );
    }

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error toggling nomenclator status:", error);
    return NextResponse.json(
      { error: true, message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
