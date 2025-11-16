"use client";
import { useQuery } from "@tanstack/react-query";
import { buildQueryParams } from "@/lib/request";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { getSupplierOrders } from "@/services/order";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllOrders } from "@/types/order";
import { useMemo } from "react";

export function useSupplierOrders(params: SearchParams) {
  const queryParams: IQueryable = useMemo(
    () => buildQueryParams(params),
    [params]
  );
  const serialized = JSON.stringify(queryParams);
  return useQuery<ApiResponse<GetAllOrders>>({
    queryKey: ["supplier-orders", serialized],
    queryFn: async () => await getSupplierOrders(queryParams as any),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
    placeholderData: (prev) => prev,
  });
}
