import ImporterSolicitudesView from "@/sections/importer/solicitudes/importer-solicitudes-view";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ImporterSolicitudesPage({ params }: Props) {
  const { id } = await params;

  return <ImporterSolicitudesView importerId={id} />;
}
