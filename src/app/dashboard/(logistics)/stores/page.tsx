import { buildQueryParams } from "@/lib/request";
import StoresPermissionWrapper from "@/sections/stores/list/stores-permission-wrapper";
import { PermissionGate } from "@/components/permission/permission-gate";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Tiendas - ZAS Express",
  description: "Administra las tiendas del sistema",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function StoresListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const apiQuery: IQueryable = buildQueryParams(params as any);
  // Pasamos tanto los params crudos como la versión construida para estabilidad en el wrapper
  return (
    <PermissionGate
      loadingFallback={
        <div className="space-y-4">
          <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"
              />
            ))}
          </div>
        </div>
      }
      keepFallbackIfMissing={false}
    >
      <StoresPermissionWrapper query={params} apiQuery={apiQuery} />
    </PermissionGate>
  );
}

export default StoresListPage;
