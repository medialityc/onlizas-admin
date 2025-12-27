import { useQuery } from "@tanstack/react-query";
import { getPendingContracts } from "@/services/importer-portal";

export function usePendingContracts(importerId: string) {
  return useQuery({
    queryKey: ["importer-pending-contracts", importerId],
    queryFn: async () => {
      const response = await getPendingContracts(importerId, {
        page: 1,
        pageSize: 100, // Obtener todas las solicitudes pendientes
      });

      console.log("=== PENDING CONTRACTS RESPONSE ===");
      console.log("Endpoint:", `/importers/${importerId}/pending-contracts`);
      console.log("Response completa:", response);
      console.log("Response.data:", response.data);
      console.log("Response.error:", response.error);
      console.log("Response.message:", response.message);
      console.log("==================================");

      if (response.error) {
        throw new Error(response.message || "Error al obtener solicitudes");
      }

      return response.data || [];
    },
    staleTime: 30 * 1000, // 30 segundos
    refetchOnWindowFocus: true,
    enabled: !!importerId,
  });
}
