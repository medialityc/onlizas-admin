import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiResponse } from "@/types/fetch/api";
import { IUser } from "@/types/users";
import { fetchUserMe, getUserById } from "@/services/users";

// Hook para obtener el perfil del usuario actual
export function useUserProfile(id?: number): UseQueryResult<IUser, Error> {
  return useQuery<IUser, Error>({
    queryKey: ["user", "profile", /* 'me' */ id],
    queryFn: async () => {
      const response: ApiResponse<IUser> = await fetchUserMe();
      /*       const response: ApiResponse<IUser> = await fetchUserMe();
       */
      console.log(response.data);

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
