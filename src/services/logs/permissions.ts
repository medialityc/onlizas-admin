"use server";

import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "../utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { GetAllPermissionsLogsResponse } from "@/types/permissions";

export async function getAllPermissionsLogs(
  params: IQueryable
): Promise<ApiResponse<GetAllPermissionsLogsResponse>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.permissions.listLogs
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["permissionlogs"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllPermissionsLogsResponse>(res);
}
