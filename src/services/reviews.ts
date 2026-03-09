"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IPagination, IQueryable } from "@/types/fetch/request";
import { GetInventoryReviewsResponse } from "@/types/reviews";
import { nextAuthFetch } from "./utils/next-auth-fetch";

const INVENTORY_REVIEWS_TAG_KEY = "inventory-reviews";

export async function getReviewsByInventoryId(
  inventoryId: string | number,
  pagination?: Partial<IPagination>
): Promise<ApiResponse<GetInventoryReviewsResponse>> {
  const query: IQueryable = {};

  if (pagination?.page || pagination?.pageSize) {
    query.pagination = {
      page: Number(pagination.page ?? 1),
      pageSize: Number(pagination.pageSize ?? 10),
    };
  }

  const url = new QueryParamsURLFactory(
    query,
    backendRoutes.reviews.byInventoryId(inventoryId)
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [INVENTORY_REVIEWS_TAG_KEY, String(inventoryId)] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetInventoryReviewsResponse>(res);
}
