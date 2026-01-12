"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import {
  CreateStaticPageRequest,
  CreateStaticPageResponse,
  GetAllStaticPagesResponse,
  StaticPageDto,
  UpdateStaticPageRequest,
  UpdateStaticPageResponse,
} from "@/types/static-pages";
import { updateTag } from "next/cache";
import { nextAuthFetch } from "./utils/next-auth-fetch";

export async function getAllStaticPages(
  params: IQueryable,
  admin: boolean = true
): Promise<ApiResponse<GetAllStaticPagesResponse>> {
  const urlFactory = new QueryParamsURLFactory(
    params,
    admin ? backendRoutes.staticPages.adminList : backendRoutes.staticPages.list
  );
  const url = urlFactory.build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["static-pages"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllStaticPagesResponse>(res);
}

export async function createStaticPage(
  data: CreateStaticPageRequest
): Promise<ApiResponse<CreateStaticPageResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.staticPages.create,
    method: "POST",
    data,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  updateTag("static-pages");
  return buildApiResponseAsync<CreateStaticPageResponse>(res);
}

export async function getStaticPageBySlug(
  slug: string
): Promise<ApiResponse<StaticPageDto>> {
  const res = await nextAuthFetch({
    url: backendRoutes.staticPages.getBySlug(slug),
    method: "GET",
    useAuth: false,
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<StaticPageDto>(res);
}

export async function getStaticPageByIdAdmin(
  id: string | number
): Promise<ApiResponse<StaticPageDto>> {
  const res = await nextAuthFetch({
    url: backendRoutes.staticPages.getByIdAdmin(id),
    method: "GET",
    useAuth: true,
    cache: "no-store",
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<StaticPageDto>(res);
}

export async function updateStaticPage(
  id: string,
  data: UpdateStaticPageRequest
): Promise<ApiResponse<UpdateStaticPageResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.staticPages.update(id),
    method: "PUT",
    data,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  updateTag("static-pages");
  return buildApiResponseAsync<UpdateStaticPageResponse>(res);
}

export async function toggleStaticPageStatus(
  id: string,
  activate: boolean
): Promise<ApiResponse<{ status: string }>> {
  const res = await nextAuthFetch({
    url: backendRoutes.staticPages.toggleStatus(id, activate),
    method: "PATCH",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  updateTag("static-pages");
  return buildApiResponseAsync<{ status: string }>(res);
}

export async function deleteStaticPage(
  id: string
): Promise<ApiResponse<{ status: string }>> {
  const res = await nextAuthFetch({
    url: backendRoutes.staticPages.delete(id),
    method: "DELETE",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  updateTag("static-pages");
  return buildApiResponseAsync<{ status: string }>(res);
}
