"use server";

import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { GetAllBusinessLogs } from "@/types/business";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "../utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";

export async function getAllBusinessLogs(
  params: IQueryable
): Promise<ApiResponse<GetAllBusinessLogs>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.business.getAllLogs
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["businesslogs"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllBusinessLogs>(res);
}
