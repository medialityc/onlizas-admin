"use server";

import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { GetAllRegionLogs } from "@/types/regions";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "../utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";

export async function getAllRegionLogs(
  params: IQueryable
): Promise<ApiResponse<GetAllRegionLogs>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.regions.getAllLogs
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["regionslogs"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllRegionLogs>(res);
}

export async function getRegionLogsByRegionId(
  regionId: number | string,
  params: IQueryable
): Promise<ApiResponse<GetAllRegionLogs>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.regions.getLogsByRegion(regionId)
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["regionslogs", `regionslogs-${regionId}`] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllRegionLogs>(res);
}