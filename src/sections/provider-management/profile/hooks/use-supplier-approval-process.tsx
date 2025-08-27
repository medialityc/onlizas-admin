import { useQuery } from "@tanstack/react-query";
import { getSupplierApprovalProcess } from "@/services/supplier";

export function useSupplierApprovalProcess() {
  return useQuery({
    queryKey: ["supplier-approval-process"],
    queryFn: async () => {
      const response = await getSupplierApprovalProcess();
      if (response.error || !response.data) {
        throw new Error(
          response.message || "Error al cargar perfil del usuario"
        );
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
