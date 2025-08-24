import { buildQueryParams } from "@/lib/request";
import StoresListContainer from "@/sections/provider-management/stores/list/stores-list-container";
import { getProviderStores } from "@/services/stores";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";
import { Suspense } from "react";

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

function StoresListSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between space-x-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded w-36"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-4 bg-gray-200 rounded animate-pulse min-h-[300px]"
          >
            <div className="space-y-2">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
            <div className="flex-1 mt-4 space-y-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="flex items-center justify-between space-x-2 mt-4">
              <div className="h-8 w-20 bg-gray-300 rounded"></div>
              <div className="h-8 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function StoresListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const storesPromise = getProviderStores(query);

  return (
    <Suspense fallback={<StoresListSkeleton />}>
      <StoresListContainer storesPromise={storesPromise} query={params} />
    </Suspense>
  );
}

export default StoresListPage;
