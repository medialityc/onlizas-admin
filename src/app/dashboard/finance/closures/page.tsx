import { buildQueryParams } from "@/lib/request";
import { getAllClosures, getMyClosures } from "@/services/finance/closures";
import { SearchParams, IQueryable } from "@/types/fetch/request";
import ClosuresListContainer from "@/sections/finance/list/closures-list-container";
import SupplierClosuresListContainer from "@/sections/finance/list/supplier-closures-list-container";
import { getModulePermissions } from "@/components/permission/server-permission-wrapper";

interface PageProps {
  searchParams: Promise<SearchParams & Record<string, any>>;
}

export const metadata = {
  title: "Cierres | Finanzas",
};

export default async function FinanceClosuresPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const { isAdmin, isSupplier } = await getModulePermissions("finance");

  if (isAdmin) {
    const closuresPromise = await getAllClosures(query);

    return (
      <ClosuresListContainer closuresPromise={closuresPromise} query={params} />
    );
  }

  if (isSupplier) {
    const closuresPromise = await getMyClosures(query);

    return (
      <SupplierClosuresListContainer
        closuresPromise={closuresPromise}
        query={params}
      />
    );
  }

  return (
    <div className="panel p-6">
      <h2 className="text-lg font-semibold mb-2">Cierres</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No tiene permisos para visualizar cierres.
      </p>
    </div>
  );
}
