import ImporterProveedoresView from "@/sections/importer/proveedores/importer-proveedores-view";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ImporterProveedoresPage({ params }: Props) {
  const { id } = await params;

  return <ImporterProveedoresView importerId={id} />;
}
