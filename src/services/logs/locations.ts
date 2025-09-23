"use server";

import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "../utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { GetAllLocationLogsResponse } from "@/types/locations";

export async function getAllLocationLogs(
  params: IQueryable
): Promise<ApiResponse<GetAllLocationLogsResponse>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.locations.listLogs
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["locationlogs"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllLocationLogsResponse>(res);
}

export async function getLocationLogsById(
  id: number | string,
  params: IQueryable
): Promise<ApiResponse<GetAllLocationLogsResponse>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.locations.getLogsById(id)
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["locationlogs", String(id)] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllLocationLogsResponse>(res);
}