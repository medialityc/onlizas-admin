import { IQueryable, SearchParams } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";
import { getAllRolesLogs } from "@/services/logs/roles";
import RolesLogsContainer from "@/sections/logs/roles/roleslogs-container";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function RolesLogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const rolesLogsPromise = getAllRolesLogs(query);
  return (
    <RolesLogsContainer
      rolesLogsPromise={rolesLogsPromise}
      searchParams={params}
    />
  );
}
