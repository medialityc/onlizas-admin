import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiResponse } from "@/types/fetch/api";
import { UserResponseMe } from "@/types/users";
import { fetchUserMe } from "@/services/users";

// Hook para obtener el perfil del usuario actual
export function useUserProfile(): UseQueryResult<UserResponseMe, Error> {
  return useQuery<UserResponseMe, Error>({
    queryKey: ["user", "profile", "me"],
    queryFn: async () => {
      const response: ApiResponse<UserResponseMe> = await fetchUserMe();

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
