import { getAllDepartmentLogs } from "@/services/logs/departments";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";
import DepartmentLogsContainer from "@/sections/logs/departments/departmentlogs-container";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function DepartmentLogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const departmentLogsPromise = await getAllDepartmentLogs(query);
  return (
    <DepartmentLogsContainer
      departmentLogsPromise={departmentLogsPromise}
      searchParams={params}
    />
  );
}
