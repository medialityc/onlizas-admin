import { buildQueryParams } from "@/lib/request";
import StoresListContainer from "@/sections/provider-management/stores/list/stores-list-container";

import { getAllStores } from "@/services/stores";
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
    <div className="panel">
      <div className="mb-5">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="flex gap-4 mb-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-64"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
      </div>
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

async function StoresListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const storesPromise = getAllStores(query);

  return (
    <Suspense fallback={<StoresListSkeleton />}>
      <StoresListContainer storesPromise={storesPromise} query={params} />
    </Suspense>
  );
}

export default StoresListPage;
