import { getAllBusinessLogs } from "@/services/logs/business";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";
import BusinessLogsContainer from "@/sections/logs/business/businesslogs-container";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function BusinessLogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const businessLogsPromise = await getAllBusinessLogs(query);
  return (
    <BusinessLogsContainer
      businessLogsPromise={businessLogsPromise}
      searchParams={params}
    />
  );
}
