import { buildQueryParams } from "@/lib/request";
import { getAllClosures } from "@/services/finance/closures";
import { SearchParams, IQueryable } from "@/types/fetch/request";
import ClosuresListContainer from "@/sections/finance/list/closures-list-container";

interface PageProps {
  searchParams: Promise<SearchParams & Record<string, any>>;
}

export const metadata = {
  title: "Cierres | Finanzas",
};

export default async function FinanceClosuresPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const closuresPromise = await getAllClosures(query);

  return (
    <ClosuresListContainer closuresPromise={closuresPromise} query={params} />
  );
}
