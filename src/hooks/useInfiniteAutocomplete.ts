import showToast from "@/config/toast/toastConfig";
import { PaginatedResponse } from "@/types/common";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseInfiniteAutocompleteOptions<T> {
  queryKey: string[];
  onFetch?: (params: IQueryable) => Promise<ApiResponse<PaginatedResponse<T>>>;
  params?: IQueryable;
  enabled?: boolean;
}

export function useInfiniteAutocomplete<T>({
  queryKey,
  onFetch,
  params = { pageSize: 35 },
  enabled = true,
}: UseInfiniteAutocompleteOptions<T>) {
  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await onFetch?.({
          page: pageParam,
          pageSize: params?.pageSize ?? 35,
          sortBy: params?.sortBy,
          isDescending: params?.isDescending ?? false,
          ...params,
        });

        if (response?.error) {
          showToast(response.message ?? "Error al cargar datos", "error");
          throw new Error(response.message ?? "Error al cargar datos");
        }

        return response?.data;
      } catch (error) {
        console.error("Error loading data:", error);
        showToast("Error al cargar opciones", "error");
        throw error;
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.hasNext) return undefined;
      return allPages.length + 1;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
