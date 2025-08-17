"use server";

import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "../utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { GetAllCurrenciesLogs } from "@/types/currencies";

export async function getAllCurrenciesLogs(
  params: IQueryable
): Promise<ApiResponse<GetAllCurrenciesLogs>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.currencies.listLogs
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["currencylogs"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllCurrenciesLogs>(res);
}
