"use server";

import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "../utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { GetAllUsersLogsResponse } from "@/types/users";

export async function getAllUsersLogs(
  params: IQueryable
): Promise<ApiResponse<GetAllUsersLogsResponse>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.users.listLogs
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["userslogs"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllUsersLogsResponse>(res);
}
