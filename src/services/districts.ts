"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { ApiResponse } from "@/types/fetch/api";
import { GetDistricts } from "@/types/zones";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { IQueryable } from "@/types/fetch/request";
import { QueryParamsURLFactory } from "@/lib/request";

export async function getDistricts(
  params: IQueryable = {}
): Promise<ApiResponse<GetDistricts>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.districts.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["districts"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetDistricts>(res);
}

export async function getDistrictsByCountry(
  countryId: string,
  params: IQueryable = {}
): Promise<ApiResponse<GetDistricts>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.districts.byCountry(countryId)
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["districts"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetDistricts>(res);
}
