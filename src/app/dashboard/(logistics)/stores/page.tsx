import { buildQueryParams } from "@/lib/request";
import StoresPermissionWrapper from "@/sections/stores/list/stores-permission-wrapper";
import { PermissionGate } from "@/components/permission/permission-gate";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";
import SkeletonStoreList from "@/sections/stores/list/components/skeleton";

export const metadata: Metadata = {
  title: "Gestión de Tiendas - Onlizas",
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
      loadingFallback={<SkeletonStoreList />}
      keepFallbackIfMissing={false}
    >
      <StoresPermissionWrapper query={params} apiQuery={apiQuery} />
    </PermissionGate>
  );
}

export default StoresListPage;
