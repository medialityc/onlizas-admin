"use client";

import { useQuery } from "@tanstack/react-query";
import { getSupplierApprovalProcess } from "@/services/supplier";
import { SupplierApprovalProcess } from "@/types/suppliers";

export function useSupplierApprovalProcess(supplierId: string | null) {
  return useQuery({
    queryKey: ["supplier-approval-process", supplierId],
    queryFn: async () => {
      if (!supplierId) {
        throw new Error("Supplier ID is required");
      }
      const response = await getSupplierApprovalProcess(supplierId);
      if (response.error || !response.data) {
        throw new Error(
          response.message || "Error al cargar perfil del usuario"
        );
      }
      return response.data;
    },
    enabled: !!supplierId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
