import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("importer_access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: true, message: "No autorizado" }, { status: 401 });
    }
    const body = await req.json();
    const { name, categoryIds } = body;
    if (!name || !Array.isArray(categoryIds)) {
      return NextResponse.json({ error: true, message: "Datos inválidos" }, { status: 400 });
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + "importer-access/nomenclators";
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Importer-Session-Token": token,
      },
      body: JSON.stringify({ name, categoryIds }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || (data && data.error)) {
      return NextResponse.json(data || { error: true }, { status: res.status });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error en /api/importer-access/nomenclators POST:", error);
    return NextResponse.json({ error: true, message: "Error interno" }, { status: 500 });
  }
}
