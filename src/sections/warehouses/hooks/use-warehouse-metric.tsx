"use client";
import { warehouseMetric } from "@/services/warehouses";
import { ApiResponse } from "@/types/fetch/api";
import { IWarehouseMetric } from "@/types/warehouses";
import { useQuery } from "@tanstack/react-query";

export const useWarehouseMetric = () => {
  return useQuery<ApiResponse<IWarehouseMetric>>({
    queryKey: ["WAREHOUSE_METRICS"],
    queryFn: () => warehouseMetric(),
    refetchInterval: 5000, // 5 segundos en milisegundos
  });
};
