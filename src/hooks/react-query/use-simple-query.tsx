import { useQuery, UseQueryResult } from "@tanstack/react-query";

// El tipo TData es para el tipo de dato que devuelve tu función fetch
export function useSimpleQuery<TData>(
  queryKey: string | any[], // La clave para el caché de React Query
  fetchFn: () => Promise<TData>, // Tu función de fetch
  enabled: boolean = true // Por si quieres controlar cuándo se ejecuta
): UseQueryResult<TData, Error> {
  return useQuery<TData, Error>({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: fetchFn,
    enabled,
  });
}
