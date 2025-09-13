"use server";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { GetAllLocations, ILocation } from "@/types/locations";
import { revalidateTag } from "next/cache";

export async function getAllLocations(
  params: IQueryable
): Promise<ApiResponse<GetAllLocations>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.locations.list
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["locations"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllLocations>(res);
}

export async function getLocationById(
  id: string | number
): Promise<ApiResponse<ILocation>> {
  const res = await nextAuthFetch({
    url: `${backendRoutes.locations.list}/${id}`,
    method: "GET",
    useAuth: true,
    next: { tags: ["locations", String(id)] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<ILocation>(res);
}

export async function deleteLocation(
  id: string | number,
  audit: { reason?: string } = {}
): Promise<ApiResponse<{ success: boolean }>> {
  const res = await nextAuthFetch({
    url: `${backendRoutes.locations.list}/${id}`,
    method: "DELETE",
    data: audit,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("locations");
  return buildApiResponseAsync<{ success: boolean }>(res);
}

export async function updateLocationStatus(
  id: string | number,
  status: "ACTIVE" | "INACTIVE",
  audit: { reason?: string } = {}
): Promise<ApiResponse<ILocation>> {
  const res = await nextAuthFetch({
    url: `${backendRoutes.locations.list}/${id}/status`,
    method: "PATCH",
    data: { status, ...audit },
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("locations");
  return buildApiResponseAsync<ILocation>(res);
}

export async function createLocation(
  data: Omit<ILocation, 'id' | 'created_at' | 'updated_at'>
): Promise<ApiResponse<ILocation>> {
  const res = await nextAuthFetch({
    url: backendRoutes.locations.list,
    method: "POST",
    data,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("locations");
  return buildApiResponseAsync<ILocation>(res);
}

export async function updateLocation(
  id: string | number,
  data: Partial<Omit<ILocation, 'id' | 'created_at' | 'updated_at'>>
): Promise<ApiResponse<ILocation>> {
  const res = await nextAuthFetch({
    url: `${backendRoutes.locations.list}/${id}`,
    method: "PUT",
    data,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("locations");
  return buildApiResponseAsync<ILocation>(res);
}
