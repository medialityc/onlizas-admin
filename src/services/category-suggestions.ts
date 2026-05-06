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
import { CategorySuggestionState } from "@/sections/category-suggestions/constants/suggestion-state";

function normalizeState(state: any): CategorySuggestionState {
  if (typeof state === "string") return state as CategorySuggestionState;
  const map: Record<number, CategorySuggestionState> = {
    0: CategorySuggestionState.PENDING,
    1: CategorySuggestionState.APPROVED,
    2: CategorySuggestionState.REJECTED,
  };
  return map[state] ?? CategorySuggestionState.PENDING;
}

function normalizeSuggestions(items: any[]): CategorySuggestion[] {
  return items.map((item) => ({
    ...item,
    state: normalizeState(item.state),
  }));
}

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

  const response = await buildApiResponseAsync<GetAllCategorySuggestions>(res);

  if (response.data?.data) {
    response.data.data = normalizeSuggestions(response.data.data);
  }

  return response;
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

  const response = await buildApiResponseAsync<GetAllCategorySuggestions>(res);

  if (response.data?.data) {
    response.data.data = normalizeSuggestions(response.data.data);
  }

  return response;
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
