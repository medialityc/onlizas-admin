import { getAllBusinessByUser } from "@/services/business";
import { Business } from "@/types/business";
import { ApiResponse } from "@/types/fetch/api";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function useBusiness(id?: number): UseQueryResult<Business[], Error> {
  return useQuery<Business[], Error>({
    queryKey: ["user", "profile", id],
    queryFn: async () => {
      const response: ApiResponse<Business[]> = await getAllBusinessByUser(
        {},
        id ?? 1
      );

      if (response.error || !response.data) {
        throw new Error(
          response.message || "Error al cargar perfil del usuario"
        );
      }

      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
