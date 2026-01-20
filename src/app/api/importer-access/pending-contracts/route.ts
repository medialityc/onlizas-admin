import { NextRequest, NextResponse } from "next/server";
import { backendRoutes } from "@/lib/endpoint";

export async function GET(request: NextRequest) {
  try {
    // Obtener token de la cookie de sesión del importador
    const token = request.cookies.get("importer_access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: true, message: "No autorizado" },
        { status: 401 }
      );
    }

    // Obtener parámetros de query
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");
    const search = searchParams.get("search");

    // Construir URL con parámetros
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page);
    if (pageSize) queryParams.append("pageSize", pageSize);
    if (search) queryParams.append("search", search);

    const url = `${backendRoutes.importerAccess.pendingContracts}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Importer-Session-Token": token,
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: true,
          message: data?.message || "Error al obtener contratos pendientes",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en pending-contracts API:", error);
    return NextResponse.json(
      { error: true, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
