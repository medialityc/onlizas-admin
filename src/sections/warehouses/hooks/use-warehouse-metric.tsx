"use client";
import { warehouseMetric } from "@/services/warehouses";
import { ApiResponse } from "@/types/fetch/api";
import { IWarehouseMetric } from "@/types/warehouses";
import { useQuery } from "@tanstack/react-query";

export const useWarehouseMetric = () => {
  return useQuery<ApiResponse<IWarehouseMetric>>({
    queryKey: ["WAREHOUSE_METRICS"],
    queryFn: async () => await warehouseMetric(),
    refetchInterval: 15 * 60 * 1000, // 1m en milisegundos
  });
};
