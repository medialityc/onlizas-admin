import ImporterNomencladoresView from "@/sections/importer/nomencladores/importer-nomencladores-view";
import { getImporterData } from "@/services/importer-access";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ImporterNomencladoresPage({ params }: Props) {
  const { id } = await params;

  const importerDataRes = await getImporterData();

  console.log("📋 [Nomencladores Page] Respuesta de getImporterData:", {
    hasError: !!importerDataRes.error,
    hasData: !!importerDataRes.data,
    message: importerDataRes.message,
  });

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

  const { nomenclators } = importerDataRes.data;

  console.log("✅ [Nomencladores Page] Datos cargados:", {
    nomenclatorsCount: nomenclators?.length || 0,
    nomenclators,
  });

  return (
    <ImporterNomencladoresView
      importerId={id}
      nomenclators={nomenclators || []}
    />
  );
}
