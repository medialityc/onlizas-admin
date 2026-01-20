import { useQuery } from "@tanstack/react-query";

export function usePendingContracts(importerId: string) {
  return useQuery({
    queryKey: ["importer-pending-contracts", importerId],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: "1",
        pageSize: "100",
      });

      const response = await fetch(
        `/api/importer-access/pending-contracts?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.message || "Error al obtener solicitudes");
      }

      return data.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos - reducir recargas
    refetchOnWindowFocus: false, // Desactivar recarga al cambiar foco
    retry: 2, // Solo reintentar 2 veces
    retryDelay: 1000, // 1 segundo entre reintentos
    enabled: !!importerId,
  });
}
