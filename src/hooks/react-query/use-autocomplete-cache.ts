import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Hook para invalidar cache de autocompletado
 */
export function useInvalidateAutocomplete() {
  const queryClient = useQueryClient();

  const invalidateAutocomplete = useCallback(
    (queryKey: string[]) => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
    [queryClient]
  );

  const invalidateAllAutocomplete = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["infinite-autocomplete"],
    });
  }, [queryClient]);

  const removeAutocompleteCache = useCallback(
    (queryKey: string[]) => {
      queryClient.removeQueries({
        queryKey,
      });
    },
    [queryClient]
  );

  return {
    invalidateAutocomplete,
    invalidateAllAutocomplete,
    removeAutocompleteCache,
  };
}

/**
 * Hook para prefetch de datos de autocompletado
 */
export function usePrefetchAutocomplete() {
  const queryClient = useQueryClient();

  const prefetchAutocomplete = useCallback(
    async (queryKey: string[], fetchFn: () => Promise<any>) => {
      await queryClient.prefetchInfiniteQuery({
        queryKey,
        queryFn: fetchFn,
        initialPageParam: 1,
      });
    },
    [queryClient]
  );

  return { prefetchAutocomplete };
}
