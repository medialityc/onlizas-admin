import { NextRequest, NextResponse } from "next/server";
import { imageConvertWebp } from "@/utils/image-convert";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const webpFile = await imageConvertWebp(file);

  if (!webpFile) {
    return NextResponse.json(
      { error: "Error converting image" },
      { status: 500 }
    );
  }

  // Devuelve el archivo WebP como respuesta
  return new NextResponse(webpFile.stream(), {
    headers: {
      "Content-Type": "image/webp",
      "Content-Disposition": `attachment; filename="${webpFile.name}"`,
    },
  });
}
