import { getAllRegionLogs } from "@/services/logs/regions";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";
import RegionsLogsContainer from "@/sections/logs/regions/regionslogs-container";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function RegionsLogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const regionsLogsPromise = await getAllRegionLogs(query);
  return (
    <RegionsLogsContainer
      regionsLogsPromise={regionsLogsPromise}
      searchParams={params}
    />
  );
}