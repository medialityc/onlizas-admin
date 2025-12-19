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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Gestión de Importadoras
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra las importadoras del sistema y sus datos asociados
          </p>
        </div>
      </div>
      <ImportersClient data={res.data} />
    </div>
  );
}
