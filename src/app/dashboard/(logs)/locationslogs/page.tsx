import { IQueryable, SearchParams } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";
import LocationLogsContainer from "@/sections/logs/locations/locationlogs-container";
import { getAllLocationLogs } from "@/services/logs/locations";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function UsersLogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const locationLogsPromise = await getAllLocationLogs(query);
  return (
    <LocationLogsContainer
      locationLogsPromise={locationLogsPromise}
      searchParams={params}
    />
  );
}
