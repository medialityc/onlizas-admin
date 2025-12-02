"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { GetAllClosures } from "@/types/finance";
import { nextAuthFetch } from "../utils/next-auth-fetch";

export async function getAllClosures(
  params: IQueryable
): Promise<ApiResponse<GetAllClosures>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.finance.closures.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["closures"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllClosures>(res);
}
