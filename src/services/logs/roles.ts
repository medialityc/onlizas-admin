"use server";

import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "../utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { GetAllRolesLogsResponse } from "@/types/roles";

export async function getAllRolesLogs(
  params: IQueryable
): Promise<ApiResponse<GetAllRolesLogsResponse>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.roles.listLogs
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["roleslogs"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllRolesLogsResponse>(res);
}
