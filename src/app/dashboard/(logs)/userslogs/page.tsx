import { getAllUsersLogs } from "@/services/logs/users";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";
import UsersLogsContainer from "@/sections/logs/users/userslogs-container";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function UsersLogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const usersLogsPromise = await getAllUsersLogs(query);
  return (
    <UsersLogsContainer
      usersLogsPromise={usersLogsPromise}
      searchParams={params}
    />
  );
}
