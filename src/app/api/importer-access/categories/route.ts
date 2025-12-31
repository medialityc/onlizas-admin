import { NextRequest, NextResponse } from "next/server";
import { backendRoutes } from "@/lib/endpoint";

export async function GET(req: NextRequest) {
  try {
    // Obtener token de la cookie de sesión del importador
    const token = req.cookies.get("importer_access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: true, message: "No autorizado" }, { status: 401 });
    }

    const url = backendRoutes.categories.listImporterAccess;
    if (!url) {
      return NextResponse.json([], { status: 200 });
    }

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-Importer-Session-Token": token,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      // Passthrough status for better debugging
      return NextResponse.json(data || { error: true }, { status: res.status });
    }

    // Ensure we return an array of active categories in the expected shape
    const categories = Array.isArray(data)
      ? data
          .filter((c: any) => c && c.active !== false)
          .map((c: any) => ({
            id: String(c.id),
            name: c.name || "",
            active: !!c.active,
            departmentId: c.departmentId || c.department?.id || "",
            departmentName: c.departmentName || c.department?.name || "",
            description: c.description || "",
            image: c.image || "",
            features: Array.isArray(c.features) ? c.features : [],
          }))
      : [];

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error in /api/importer-access/categories:", error);
    return NextResponse.json({ error: true, message: "Error interno" }, { status: 500 });
  }
}
