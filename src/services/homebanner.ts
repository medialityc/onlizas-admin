"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";

import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import {
  IHomeBanner,
  IGetAllHomeBanner,
  UpdateBanner,
} from "@/types/home-banner";

export async function createHomeBanner(
  data: FormData
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.content.homeBanner.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag("content-home-banner");
  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function updateHomeBanner(
  id: string | number,
  data: FormData
): Promise<ApiResponse<UpdateBanner>> {
  const res = await nextAuthFetch({
    url: backendRoutes.content.homeBanner.update,
    method: "PUT",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("content-home-banner");

  return buildApiResponseAsync<IHomeBanner>(res);
}

export async function getAllHomeBanner(
  params: IQueryable
): Promise<ApiResponse<IGetAllHomeBanner>> {
  const url = new QueryParamsURLFactory(
    { ...params, isDescending: true },
    backendRoutes.content.homeBanner.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["content-home-banner"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<IGetAllHomeBanner>(res);
}

export async function getHomeBannerById(
  id: string | number
): Promise<ApiResponse<IHomeBanner>> {
  const res = await nextAuthFetch({
    url: backendRoutes.content.homeBanner.getOne(id),
    method: "GET",
    useAuth: true,
    next: { tags: ["content-home-banner"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<IHomeBanner>(res);
}

export async function deleteHomeBannerById(
  id: string | number
): Promise<ApiResponse<IHomeBanner>> {
  const res = await nextAuthFetch({
    url: backendRoutes.content.homeBanner.delete,
    method: "DELETE",
    useAuth: true,
    next: { tags: ["content-home-banner"] },
    data: { id },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<IHomeBanner>(res);
}

export async function toggleStatusHomeBanner(
  id: string | number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.content.homeBanner.toggleStatus,
    method: "PATCH",
    useAuth: true,
    data: {
      id,
    },
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("categories");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}
