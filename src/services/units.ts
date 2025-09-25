"use server";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { PaginatedResponse } from "@/types/common";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { Unit } from "@/types/units";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";

export async function getAllUnits(
  params: IQueryable
): Promise<ApiResponse<PaginatedResponse<Unit>>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.unit.list
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["units"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync(res);
}
