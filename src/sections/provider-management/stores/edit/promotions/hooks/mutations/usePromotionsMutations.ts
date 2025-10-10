import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  deletePromotion,
  togglePromotionStatus, 
  updatePromotionAutomatic,
  createPromotionAutomatic
} from "@/services/promotions";

/**
 * Hook para mutations de promociones
 * Maneja create, update, delete y toggle por separado
 */
export function usePromotionsMutations(storeId: string | number) {
  const queryClient = useQueryClient();

  // Función helper para invalidar queries
  const invalidatePromotionQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["store-promotions", storeId], exact: false });
    queryClient.invalidateQueries({ queryKey: ["store-promotions-summary", storeId] });
  };

  // Crear promoción
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await createPromotionAutomatic(formData);
      if (res.error) {
        throw new Error(res.message || res.detail || "Error desconocido");
      }
      return res;
    },
    onSuccess: () => {
      invalidatePromotionQueries();
      toast.success("Promoción creada exitosamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al crear la promoción");
    },
  });

  // Actualizar promoción
  const updateMutation = useMutation({
    mutationFn: async ({ promotionId, data }: { promotionId: number; data: FormData }) => {
      const res = await updatePromotionAutomatic(promotionId, data);
      if (res.error) {
        throw new Error(res.message || res.detail || "Error desconocido");
      }
      return res;
    },
    onSuccess: () => {
      invalidatePromotionQueries();
      toast.success("Promoción actualizada exitosamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al actualizar la promoción");
    },
  });

  // Eliminar promoción
  const deleteMutation = useMutation({
    mutationFn: async (promotionId: number) => {
      const res = await deletePromotion(promotionId);
      if (res.error) {
        throw new Error(res.message || res.detail || "Error desconocido");
      }
      return res;
    },
    onSuccess: () => {
      invalidatePromotionQueries();
      toast.success("Promoción eliminada exitosamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al eliminar la promoción");
    },
  });

  // Toggle status - LÓGICA MANTENIDA PARA USO EN FORMULARIOS
  const toggleMutation = useMutation({
    mutationFn: async (promotionId: number) => {
      const res = await togglePromotionStatus(promotionId);
      if (res.error) {
        throw new Error(res.message || res.detail || "Error al cambiar estado");
      }
      return res;
    },
    onSuccess: () => {
      // Invalidación simple para formularios futuros
      //invalidatePromotionQueries();
      toast.success("Estado actualizado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al cambiar el estado");
    },
  });

  return {
    // Mutations (sync + async variants)
    createPromotion: createMutation.mutate,
    createPromotionAsync: createMutation.mutateAsync,
    updatePromotion: updateMutation.mutate,
    updatePromotionAsync: updateMutation.mutateAsync,
    deletePromotion: deleteMutation.mutate,
    deletePromotionAsync: deleteMutation.mutateAsync,
    toggleStatus: toggleMutation.mutate,
    toggleStatusAsync: toggleMutation.mutateAsync,
    
    // States
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleMutation.isPending,
  };
}
