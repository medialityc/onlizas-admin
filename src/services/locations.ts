import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { WarehouseFilter } from "@/types/warehouses";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { GetAllLocations } from "@/types/locations";

export async function getAllLocations(
  params: IQueryable & WarehouseFilter
): Promise<ApiResponse<GetAllLocations>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.locations.list
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["locations"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllLocations>(res);
}
