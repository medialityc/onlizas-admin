"use client";

import { useQuery } from "@tanstack/react-query";
import { getRegionById } from "@/services/regions";
import { Region } from "@/types/regions";

export function useRegionDetails(id: number|string | undefined, enabled: boolean = true) {
  return useQuery({
    queryKey: ["region-details", id],
    queryFn: () => getRegionById(id!),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}