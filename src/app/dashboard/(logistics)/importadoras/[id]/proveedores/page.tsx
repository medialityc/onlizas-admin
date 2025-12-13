import { getImporterById } from "@/services/importers";
import { notFound } from "next/navigation";
import ProvidersTableClient from "@/sections/importers/providers/providers-table.client";

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}


export default async function ImporterProvidersPage({ params }: Props) {
  const { id } = await params;

  const importerRes = await getImporterById(id);

  if (importerRes.error || !importerRes.data) {
    notFound();
  }

  const contracts = importerRes.data.contracts || [];
  const nomenclators = importerRes.data.nomenclators || [];

  return (
    <ProvidersTableClient
      importerName={importerRes.data.name}
      importerId={id}
      contracts={contracts}
      nomenclators={nomenclators}
    />
  );
}

