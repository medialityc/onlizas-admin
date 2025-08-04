"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { ApiResponse } from "@/types/fetch/api";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { Country } from "@/types/countries";

export async function getCountries(): Promise<ApiResponse<Country[]>> {
  const res = await nextAuthFetch({
    url: `https://api.zasdistributor.com/api/countries`,
    method: "GET",
    useAuth: false,
    cache: "no-store",
    next: { tags: ["countries"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<Country[]>(res);
}
