"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";

import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import {
  ISection,
  IGetAllAdminsSection,
  UpdateSection,
} from "@/types/section";

export async function createSection(
  data: FormData
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.content.section.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag("admin-section");
  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function updateSection(
  id: string | number,
  data: FormData
): Promise<ApiResponse<UpdateSection>> {
  const res = await nextAuthFetch({
    url: backendRoutes.content.section.update(id),
    method: "PUT",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("admin-section");

  return buildApiResponseAsync<ISection>(res);
}

export async function getAllSection(
  params: IQueryable
): Promise<ApiResponse<IGetAllAdminsSection>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.content.section.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["admin-section"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<IGetAllAdminsSection>(res);
}

/* export async function getCategoryById(
  id: string | number
): Promise<ApiResponse<ISection>> {
  const res = await nextAuthFetch({
    url: backendRoutes.content.section(id),
    method: "GET",
    useAuth: true,
    next: { tags: ["admin-section"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<ISection>(res);
} */
