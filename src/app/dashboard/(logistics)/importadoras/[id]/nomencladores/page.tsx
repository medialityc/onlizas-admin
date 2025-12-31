import { getImporterById } from "@/services/importers";
import NomenclatorsListClient from "@/sections/importers/nomenclators/nomenclators-list.client";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ImporterNomenclatorsPage({ params }: Props) {

  const { id } = await params;
  
  const importerDataRes = await getImporterById(id);

  if (importerDataRes.error || !importerDataRes.data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">
            Error cargando datos de la importadora: {importerDataRes.message}
          </p>
        </div>
      </div>
    );
  }

  const { name: importerName, nomenclators } = importerDataRes.data;

  return (
    <NomenclatorsListClient
      data={nomenclators || []}
      importerName={importerName}
      importerId={id}
    />
  );
}
