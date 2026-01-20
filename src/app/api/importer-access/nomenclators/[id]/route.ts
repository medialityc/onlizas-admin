import { NextRequest, NextResponse } from "next/server";
import { backendRoutes } from "@/lib/endpoint";

export async function PUT(
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
    const body = await request.json();
    const { name, categoryIds } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: true, message: "El nombre es requerido" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}importer-access/nomenclators/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Importer-Session-Token": token,
        },
        body: JSON.stringify({
          name: name.trim(),
          categoryIds: categoryIds || [],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: true, message: data.message || "Error al actualizar nomenclador" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating nomenclator:", error);
    return NextResponse.json(
      { error: true, message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
