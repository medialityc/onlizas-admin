"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";

import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "../utils/next-auth-fetch";
import { revalidateTag } from "next/cache";

import { Units, CreateUnits, UpdateUnits, GetAllUnits } from "@/types/units";

// - [ ] CREATE UNIT
export async function createUnit(
  data: CreateUnits
): Promise<ApiResponse<Units>> {
  const res = await nextAuthFetch({
    url: backendRoutes.units.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("units");

  return buildApiResponseAsync<Units>(res);
}

// - [ ] DELETE UNIT
export async function deleteUnit(
  id: number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.units.delete(id),
    method: "DELETE",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("units");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

// - [ ] GET ALL UNITS
export async function getAllUnits(
  params: IQueryable
): Promise<ApiResponse<GetAllUnits>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.units.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["units"], revalidate: 3600 },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllUnits>(res);
}

// - [ ] UPDATE UNIT
export async function updateUnit(
  id: number,
  data: UpdateUnits
): Promise<ApiResponse<Units>> {
  const res = await nextAuthFetch({
    url: backendRoutes.units.update(id),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("units");
  return buildApiResponseAsync<Units>(res);
}
