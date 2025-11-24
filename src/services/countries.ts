"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { ApiResponse } from "@/types/fetch/api";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { Country } from "@/types/countries";
import { PaginatedResponse } from "@/types/common";

export async function getCountries(): Promise<ApiResponse<Country[]>> {
  const res = await nextAuthFetch({
    url: `${process.env.NEXT_PUBLIC_API_URL}countries`,
    method: "GET",
    useAuth: true,
    cache: "no-store",
    next: { tags: ["countries"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<Country[]>(res);
}

export async function getCountriesPaginated(params: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<PaginatedResponse<Country>>> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 35;

  // Reuse existing getCountries() which fetches the full list from the API
  const allRes = await getCountries();
  if (allRes.error)
    return {
      data: null as any,
      status: allRes.status,
      error: true,
      message: allRes.message,
    };

  const all = allRes.data || [];
  const q = params.search?.toString().trim().toLowerCase() ?? "";
  const filtered =
    q === ""
      ? all
      : all.filter(
          (c) =>
            String(c.name).toLowerCase().includes(q) ||
            String(c.code).toLowerCase().includes(q)
        );

  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  const paginated: PaginatedResponse<Country> = {
    data: pageItems,
    totalCount: filtered.length,
    page,
    pageSize,
    hasNext: start + pageSize < filtered.length,
    hasPrevious: page > 1,
  };

  return { data: paginated, status: 200, error: false };
}
