"use server";

import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "../utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { GetAllDepartmentsLogs } from "@/types/departments";

export async function getAllDepartmentLogs(
  params: IQueryable
): Promise<ApiResponse<GetAllDepartmentsLogs>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.departments.listLogs
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["departmentlogs"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllDepartmentsLogs>(res);
}
