import { getImporters } from "@/services/importers";
import ImportersClient from "@/sections/importers/list/importers.client";

export const dynamic = "force-dynamic";

export default async function ImportersPage() {
  const res = await getImporters();

  if (res.error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">
            Error cargando importadoras: {res.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-dark dark:text-white-light">
            Importadoras
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gestiona las importadoras y sus nomencladores
          </p>
        </div>
      </div>
      <ImportersClient data={res.data} />
    </div>
  );
}
