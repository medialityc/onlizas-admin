import { getImporters } from "@/services/importers";
import ImportersClient from "@/sections/importers/list/importers.client";

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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Importadoras
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Gestiona las importadoras y sus nomencladores
        </p>
      </div>
      
      <ImportersClient data={res.data} />
    </div>
  );
}
