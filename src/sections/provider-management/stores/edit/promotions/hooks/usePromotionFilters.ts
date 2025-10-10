import { useState, useCallback } from "react";
import { PromotionSearchParams } from "@/types/promotions";

/**
 * Hook para la gestión de filtros y búsqueda
 * Separa la lógica de filtros del resto de la funcionalidad
 */
export function usePromotionFilters(initialParams: PromotionSearchParams = {}) {
  const [searchParams, setSearchParams] = useState<PromotionSearchParams>(initialParams);
  const [localSearchValue, setLocalSearchValue] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Actualizar parámetros de búsqueda
  const updateSearchParams = useCallback((params: Partial<PromotionSearchParams>) => {
    setSearchParams(prev => {
      const newParams = { ...prev };
      
      // Procesar cada parámetro
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          delete newParams[key as keyof PromotionSearchParams];
        } else {
          (newParams as any)[key] = value;
        }
      });
      
      // Siempre resetear a página 1 cuando hay cambios
      newParams.page = 1;
      
      return newParams;
    });
  }, []);

  // Manejar búsqueda
  const handleSearch = useCallback((search: string) => {
    setLocalSearchValue(search);
    updateSearchParams({ search: search || undefined });
  }, [updateSearchParams]);

  // Manejar cambio de filtros
  const handleFilterChange = useCallback((status: string) => {
    setFilterStatus(status);
    
    switch (status) {
      case "active":
        updateSearchParams({ active: true });
        break;
      case "inactive":
        updateSearchParams({ active: false });
        break;
      default:
        updateSearchParams({ active: undefined });
        break;
    }
  }, [updateSearchParams]);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setFilterStatus("all");
    setLocalSearchValue("");
    setSearchParams(initialParams);
  }, [initialParams]);

  // Paginación
  const handlePageChange = useCallback((page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setSearchParams(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  return {
    // Estado
    searchParams,
    localSearchValue,
    filterStatus,
    
    // Handlers
    handleSearch,
    handleFilterChange,
    clearFilters,
    handlePageChange,
    handlePageSizeChange,
    updateSearchParams,
  };
}
