import { IQueryable, SearchParams } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";
import { getAllPermissionsLogs } from "@/services/logs/permissions";
import PermissionsLogsContainer from "@/sections/logs/permissions/permissionslogs-container";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function PermissionsLogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const permissionsLogsPromise = await getAllPermissionsLogs(query);
  return (
    <PermissionsLogsContainer
      permissionsLogsPromise={permissionsLogsPromise}
      searchParams={params}
    />
  );
}
