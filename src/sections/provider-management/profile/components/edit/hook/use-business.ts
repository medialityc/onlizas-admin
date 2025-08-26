import { getAllBusinessByUser } from "@/services/business";
import { Business, GetAllBusiness } from "@/types/business";
import { PaginatedResponse } from "@/types/common";
import { ApiResponse } from "@/types/fetch/api";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function useBusiness(): UseQueryResult<Business[], Error> {
  return useQuery<Business[], Error>({
    queryKey: ["user", "profile", "business"],
    queryFn: async () => {
      const response: ApiResponse<PaginatedResponse<Business>> =
        await getAllBusinessByUser({});

      if (response.error || !response.data) {
        throw new Error(
          response.message || "Error al cargar perfil del usuario"
        );
      }
      console.log(response.data);

      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
