"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import {
  CategorySuggestion,
  CreateCategorySuggestionPayload,
  GetAllCategorySuggestions,
  ReviewCategorySuggestionPayload,
} from "@/types/category-suggestions";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { updateTag } from "next/cache";

export async function getAllCategorySuggestions(
  params: IQueryable,
): Promise<ApiResponse<GetAllCategorySuggestions>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.categorySuggestions.list,
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["category-suggestions"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllCategorySuggestions>(res);
}

export async function getMyCategorySuggestions(
  params: IQueryable,
): Promise<ApiResponse<GetAllCategorySuggestions>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.categorySuggestions.mine,
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["category-suggestions"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllCategorySuggestions>(res);
}

export async function createCategorySuggestion(
  data: CreateCategorySuggestionPayload,
): Promise<ApiResponse<CategorySuggestion>> {
  const res = await nextAuthFetch({
    url: backendRoutes.categorySuggestions.create,
    method: "POST",
    data,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  updateTag("category-suggestions");
  return buildApiResponseAsync<CategorySuggestion>(res);
}

export async function reviewCategorySuggestion(
  id: string | number,
  data: ReviewCategorySuggestionPayload,
): Promise<ApiResponse<CategorySuggestion>> {
  const res = await nextAuthFetch({
    url: backendRoutes.categorySuggestions.review(id),
    method: "PATCH",
    data,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  updateTag("category-suggestions");
  return buildApiResponseAsync<CategorySuggestion>(res);
}
