import { buildQueryParams } from "@/lib/request";
import BusinessListContainer from "@/sections/business/list/business-list-container";
import RegionListContainer from "@/sections/regions/list/region-list-container";
import { getAllBusiness } from "@/services/business";
import { getRegions } from "@/services/regions";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Gestión de Regiones - Onlizas",
  description: "Administra las regiones del sistema y sus datos asociados",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

function RegionsListSkeleton() {
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

async function RegionsListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const regionsPromise = await getRegions(query);

  return (
    <Suspense fallback={<RegionsListSkeleton />}>
      <RegionListContainer regionsPromise={regionsPromise} query={params} />
    </Suspense>
  );
}

export default RegionsListPage;
