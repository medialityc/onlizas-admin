import { getAllCurrenciesLogs } from "@/services/logs/currencies";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";
import CurrenciesLogsContainer from "@/sections/logs/currencies/currencieslogs-container";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function CurrenciesLogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const currenciesLogsPromise = getAllCurrenciesLogs(query);
  return (
    <CurrenciesLogsContainer
      currenciesLogsPromise={currenciesLogsPromise}
      searchParams={params}
    />
  );
}
