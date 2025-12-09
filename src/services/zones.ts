"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { ApiResponse } from "@/types/fetch/api";
import { GetZones, Zone, CreateZonePayload, UpdateZonePayload } from "@/types/zones";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import { IQueryable } from "@/types/fetch/request";
import { QueryParamsURLFactory } from "@/lib/request";

const ZONES_TAG = "zones";

export async function getZones(params: IQueryable = {}): Promise<ApiResponse<GetZones>> {
  const url = new QueryParamsURLFactory(params, backendRoutes.zones.list).build();
  
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [ZONES_TAG] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetZones>(res);
}

export async function getMyZones(params: IQueryable = {}): Promise<ApiResponse<GetZones>> {
  const url = new QueryParamsURLFactory(params, backendRoutes.zones.myZones).build();
  
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [ZONES_TAG] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetZones>(res);
}

export async function getOnlizasZones(params: IQueryable = {}): Promise<ApiResponse<GetZones>> {
  const url = new QueryParamsURLFactory(params, backendRoutes.zones.onlizasZones).build();
  
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [ZONES_TAG] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetZones>(res);
}

export async function getZonesBySupplier(
  supplierId: string | number
): Promise<ApiResponse<GetZones>> {
  const res = await nextAuthFetch({
    url: backendRoutes.zones.bySupplier(supplierId),
    method: "GET",
    useAuth: true,
    next: { tags: [ZONES_TAG] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetZones>(res);
}

export async function createZone(
  data: CreateZonePayload
): Promise<ApiResponse<Zone>> {
  const res = await nextAuthFetch({
    url: backendRoutes.zones.create,
    method: "POST",
    useAuth: true,
    data: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag(ZONES_TAG);
  return buildApiResponseAsync<Zone>(res);
}

export async function getZoneById(
  id: string | number
): Promise<ApiResponse<Zone>> {
  const res = await nextAuthFetch({
    url: backendRoutes.zones.detail(id),
    method: "GET",
    useAuth: true,
    next: { tags: [ZONES_TAG] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<Zone>(res);
}

export async function updateZone(
  id: string | number,
  data: UpdateZonePayload
): Promise<ApiResponse<Zone>> {
  const res = await nextAuthFetch({
    url: backendRoutes.zones.update(id),
    method: "PUT",
    useAuth: true,
    data: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag(ZONES_TAG);
  return buildApiResponseAsync<Zone>(res);
}

export async function deleteZone(
  id: string | number
): Promise<ApiResponse<void>> {
  const res = await nextAuthFetch({
    url: backendRoutes.zones.delete(id),
    method: "DELETE",
    useAuth: true,
    data: JSON.stringify({}),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag(ZONES_TAG);
  return { error: false, status: res.status, data: undefined };
}
