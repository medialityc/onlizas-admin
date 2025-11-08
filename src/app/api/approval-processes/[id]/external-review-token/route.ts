import { NextResponse } from "next/server";
import { backendRoutes } from "@/lib/endpoint";
import { getErrorMessage } from "@/lib/api";

// Proxy para generar token de revisión externa de un ApprovalProcess
// POST /api/approval-processes/[id]/external-review-token
// Asume backend responde { token: string }
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
  try {
    const res = await fetch(
      backendRoutes.approvalProcesses.externalReviewToken(id),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Podrías incluir body si backend lo requiere (ej: usos máximos). De momento vacío.
        cache: "no-store",
      }
    );
    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: "Proceso no encontrado" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "No se pudo generar el token" },
        { status: res.status }
      );
    }
    const data = await res.json();
    if (!data?.token) {
      return NextResponse.json(
        { error: "Respuesta inválida del backend" },
        { status: 500 }
      );
    }
    return NextResponse.json({ token: data.token });
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}
