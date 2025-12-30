import ImporterContratosView from "@/sections/importer/contratos/importer-contratos-view";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ImporterContratosPage({ params }: Props) {
  const { id } = await params;

  return <ImporterContratosView importerId={id} />;
}
