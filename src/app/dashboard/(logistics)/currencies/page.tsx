import { buildQueryParams } from "@/lib/request";
import CurrenciesListContainer from "@/sections/currencies/list/currencies-list-container";
import { getAllCurrencies } from "@/services/currencies";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

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

async function CurrenciesListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const currenciesPromise = await getAllCurrencies(query);

  return (
    <CurrenciesListContainer
      currenciesPromise={currenciesPromise}
      query={params}
    />
  );
}

export default CurrenciesListPage;
