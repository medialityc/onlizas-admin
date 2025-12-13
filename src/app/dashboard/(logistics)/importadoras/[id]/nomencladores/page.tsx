import { getImporterById, getImporterNomenclators } from "@/services/importers";
import NomenclatorsListClient from "@/sections/importers/nomenclators/nomenclators-list.client";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ImporterNomenclatorsPage({ params }: Props) {

  const { id } = await params;
  
  const [importerRes, nomenclatorsRes] = await Promise.all([
    getImporterById(id),
    getImporterNomenclators(id),
  ]);

  if (importerRes.error || !importerRes.data) {
    notFound();
  }

  if (nomenclatorsRes.error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">
            Error cargando nomencladores: {nomenclatorsRes.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <NomenclatorsListClient
      data={nomenclatorsRes.data?.data || []}
      importerName={importerRes.data.name}
      importerId={id}
    />
  );
}
