import { buildQueryParams } from "@/lib/request";
import CurrenciesListContainer from "@/sections/currencies/list/currencies-list-container";

import { getAllCurrencies } from "@/services/currencies";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Gestión de Monedas - ZAS Express",
  description: "Administra las monedas del sistema y sus tasas de cambio",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

function CurrenciesListSkeleton() {
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

async function CurrenciesListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const currenciesPromise = getAllCurrencies(query);

  return (
    <Suspense fallback={<CurrenciesListSkeleton />}>
      <CurrenciesListContainer
        currenciesPromise={currenciesPromise}
        query={params}
      />
    </Suspense>
  );
}

export default CurrenciesListPage;
