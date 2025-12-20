import ImporterNomencladoresView from "@/sections/importer/nomencladores/importer-nomencladores-view";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ImporterNomencladoresPage({ params }: Props) {
  const { id } = await params;

  return <ImporterNomencladoresView importerId={id} />;
}
