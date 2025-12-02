import { useQuery } from "@tanstack/react-query";
import { getStorePromotions } from "@/services/promotions";
import { PromotionSearchParams, PromotionMetrics } from "@/types/promotions";
import { IQueryable } from "@/types/fetch/request";
import { useMemo } from "react";

/**
 * Hook separado para la gestión de datos y métricas de promociones
 * Se enfoca únicamente en la obtención y cálculo de datos
 */
export function usePromotionsData(
  storeId: string | number,
  searchParams: PromotionSearchParams
) {
  // Query principal con filtros - CONFIGURACIÓN BÁSICA
  const promotionsQuery = useQuery({
    queryKey: ["store-promotions", storeId, searchParams],
    queryFn: () => getStorePromotions(storeId, searchParams as IQueryable),
    enabled: !!storeId,
  });

  // Query para métricas globales - CONFIGURACIÓN BÁSICA
  const summaryQuery = useQuery({
    queryKey: ["store-promotions-summary", storeId],
    queryFn: () =>
      getStorePromotions(storeId, { page: 1, pageSize: 10 } as IQueryable),
    enabled: !!storeId,
  });

  // Datos procesados
  const promotions = promotionsQuery.data?.data?.data || [];
  const totalCount = promotionsQuery.data?.data?.totalCount || 0;
  const pageSize = promotionsQuery.data?.data?.pageSize || 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Métricas globales calculadas
  const metrics = useMemo((): PromotionMetrics => {
    // Usar todas las promociones desde summaryQuery si están disponibles, sino usar las de la consulta actual
    const summaryPromotions = summaryQuery.data?.data?.data || [];
    const source =
      summaryPromotions.length > 0 ? summaryPromotions : promotions;

    // Para el total, usar el totalCount de la respuesta principal que es más confiable
    const total =
      totalCount || summaryQuery.data?.data?.totalCount || source.length;
    const active = source.filter((p) => p.active).length;
    const uses = source.reduce((acc, p) => acc + (p.usedCount || 0), 0);
    const expired = source.filter(
      (p) => p.endDate && new Date(p.endDate) < new Date()
    ).length;

    return { total, active, uses, expired };
  }, [promotions, summaryQuery.data, totalCount]);

  return {
    // Datos
    promotions,
    totalCount,
    totalPages,
    pageSize,
    metrics,

    // Estados de carga
    isLoading: promotionsQuery.isLoading,
    isLoadingSummary: summaryQuery.isLoading,
    error: promotionsQuery.error,

    // Métodos
    refetch: promotionsQuery.refetch,
    refetchSummary: summaryQuery.refetch,
  };
}
