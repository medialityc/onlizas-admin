import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Promotion,
  PromotionSearchParams,
  UpdatePromotionRequest,
  PromotionMetrics
} from "@/types/promotions";
import { IQueryable } from "@/types/fetch/request";
import {
  getStorePromotions,
  createPromotionCode,
  updatePromotionCode,
  deletePromotion,
  togglePromotionStatus
} from "@/services/promotions";

export function usePromotions(storeId: number, initialParams: PromotionSearchParams = {}) {
  const [searchParams, setSearchParams] = useState<PromotionSearchParams>(initialParams);
  const queryClient = useQueryClient();

  // Query para obtener promociones
  const {
    data: promotionsResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["store-promotions", storeId, searchParams],
    queryFn: () => getStorePromotions(storeId, searchParams as IQueryable),
    enabled: !!storeId,
  });

  // Query resumen (sin filtros) para métricas globales — evita que las métricas cambien al aplicar filtros
  const { data: summaryResponse } = useQuery({
    queryKey: ["store-promotions-summary", storeId],
  queryFn: () => getStorePromotions(storeId, { page: 1, pageSize: 10 } as IQueryable),
    enabled: !!storeId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutation para crear promoción
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await createPromotionCode(formData)
      if (res.error) {
        throw new Error(res.message || res.detail || "Error desconocido");
      } return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-promotions", storeId], exact: false });
      queryClient.invalidateQueries({ queryKey: ["store-promotions-summary", storeId] });
      toast.success("Promoción creada exitosamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al crear la promoción");
    },
  });

  // Mutation para actualizar promoción con FormData
  const updateMutation = useMutation({
    mutationFn: async ({ promotionId, data }: { promotionId: number; data: FormData }) => {
      const res = await updatePromotionCode(promotionId, data)
      if (res.error) {
        throw new Error(res.message || res.detail || "Error desconocido");
      } return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-promotions", storeId], exact: false });
      queryClient.invalidateQueries({ queryKey: ["store-promotions-summary", storeId] });
      toast.success("Promoción actualizada exitosamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al actualizar la promoción");
    },
  });

  // Mutation para eliminar promoción
  const deleteMutation = useMutation({
    mutationFn: async (promotionId: number) => {
      const res = await deletePromotion(promotionId);
      console.log(res)
      // Si hay error en la respuesta, lanzarlo para que React Query lo maneje
      if (res.error) {
        throw new Error(res.message || res.detail || "Error desconocido");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-promotions", storeId], exact: false });
      queryClient.invalidateQueries({ queryKey: ["store-promotions-summary", storeId] });
      toast.success("Promoción eliminada exitosamente");
    },
    onError: (error: any) => {
      console.log("Error en deleteMutation:", error);
      toast.error(error?.message || "Error al eliminar la promoción");
    },
  });

  // Mutation para toggle status
  const toggleMutation = useMutation({
    mutationFn: (promotionId: number) => togglePromotionStatus(promotionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-promotions", storeId], exact: false });
      queryClient.invalidateQueries({ queryKey: ["store-promotions-summary", storeId] });
      toast.success("Estado de la promoción actualizado");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al cambiar el estado de la promoción");
    },
  });

  // Datos computados
  const promotions = promotionsResponse?.data?.data || [];
  const totalCount = promotionsResponse?.data?.totalCount || 0;
  const pageSize = promotionsResponse?.data?.pageSize || 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Métricas calculadas: preferir la query resumen (global) cuando esté disponible
  const metrics = useMemo((): PromotionMetrics => {
    const summaryPromotions: Promotion[] = summaryResponse?.data?.data || [];

    const source = summaryPromotions.length > 0 ? summaryPromotions : promotions;

    const total = (summaryResponse?.data?.totalCount) ?? source.length;
    const active = source.filter((p: Promotion) => p.isActive).length;
    const uses = source.reduce((acc: number, p: Promotion) => acc + (p.usedCount || 0), 0);
    const expired = source.filter((p: Promotion) => p.endDate && new Date(p.endDate) < new Date()).length;

    return { total, active, uses, expired };
  }, [promotions, summaryResponse]);

  // Handlers
  const updateSearchParams = useCallback((params: Partial<PromotionSearchParams>) => {
    setSearchParams(prev => {
      const newParams = { ...prev };
      
      // Procesar cada parámetro
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          // Eliminar la clave si el valor es undefined o null
          delete (newParams as any)[key];
        } else {
          // Asignar el nuevo valor
          (newParams as any)[key] = value;
        }
      });
      
      // Siempre resetear a página 1 cuando hay cambios
      newParams.page = 1;
      
      return newParams;
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setSearchParams(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  // Toggle con optimistic update inteligente que respeta filtros
  const handleToggle = useCallback(async (id: number, checked: boolean) => {
    // Verificar si hay filtro activo que afecte el resultado
    const hasActiveFilter = searchParams.isActive !== undefined;
    const willMatchFilter = hasActiveFilter ? searchParams.isActive === checked : true;

    // Si hay filtro y la promoción no va a coincidir después del cambio, 
    // usar invalidación simple para que desaparezca correctamente
    if (hasActiveFilter && !willMatchFilter) {
      try {
        const res = await togglePromotionStatus(id);
        if (res?.error) {
          toast.error(res?.message || "No se pudo actualizar el estado");
        } else {
          // Invalidar para refrescar y que desaparezca de la lista filtrada
          queryClient.invalidateQueries({ queryKey: ["store-promotions", storeId], exact: false });
          queryClient.invalidateQueries({ queryKey: ["store-promotions-summary", storeId] });
          toast.success(checked ? "Promoción activada" : "Promoción desactivada");
        }
      } catch (error) {
        toast.error("Error al actualizar el estado de la promoción");
      }
      return;
    }

    // Si no hay filtro o la promoción seguirá siendo visible, usar optimistic update
    const previousData = promotions;

    // Actualizar localmente primero
    queryClient.setQueryData(["store-promotions", storeId, searchParams], (old: any) => {
      if (!old?.data?.data) return old;

      return {
        ...old,
        data: {
          ...old.data,
          data: old.data.data.map((promotion: Promotion) =>
            promotion.id === id
              ? { ...promotion, isActive: checked }
              : promotion
          ),
        },
      };
    });

    // También actualizar la summary para las métricas
    queryClient.setQueryData(["store-promotions-summary", storeId], (old: any) => {
      if (!old?.data?.data) return old;

      return {
        ...old,
        data: {
          ...old.data,
          data: old.data.data.map((promotion: Promotion) =>
            promotion.id === id
              ? { ...promotion, isActive: checked }
              : promotion
          ),
        },
      };
    });

    try {
      const res = await togglePromotionStatus(id);
      if (res?.error) {
        // Revertir cambio optimista si hay error
        queryClient.setQueryData(["store-promotions", storeId, searchParams], (old: any) => {
          if (!old?.data?.data) return old;

          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map((promotion: Promotion) =>
                promotion.id === id
                  ? { ...promotion, isActive: !checked }
                  : promotion
              ),
            },
          };
        });
        // Revertir summary también
        queryClient.invalidateQueries({ queryKey: ["store-promotions-summary", storeId] });
        toast.error(res?.message || "No se pudo actualizar el estado");
      } else {
        // Asegurar que las métricas se actualicen correctamente
        queryClient.invalidateQueries({ queryKey: ["store-promotions-summary", storeId] });
        toast.success(checked ? "Promoción activada" : "Promoción desactivada");
      }
    } catch (error) {
      // Revertir cambio optimista si hay excepción
      queryClient.setQueryData(["store-promotions", storeId, searchParams], (old: any) => {
        if (!old?.data?.data) return old;

        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((promotion: Promotion) =>
              promotion.id === id
                ? { ...promotion, isActive: !checked }
                : promotion
            ),
          },
        };
      });
      // Revertir summary también
      queryClient.invalidateQueries({ queryKey: ["store-promotions-summary", storeId] });
      toast.error("Error al actualizar el estado de la promoción");
    }
  }, [promotions, queryClient, storeId, searchParams]);

  return {
    // Data
    promotions,
    totalCount,
    totalPages,
    metrics,
    searchParams,

    // Loading states
    isLoading,
    error,

    // Mutations
    createPromotion: createMutation.mutate,
    updatePromotion: updateMutation.mutate,
    deletePromotion: deleteMutation.mutate,
    toggleStatus: handleToggle, // Usar el handler personalizado

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleMutation.isPending,

    // Handlers
    updateSearchParams,
    handlePageChange,
    handlePageSizeChange,
    refetch,
  };
}