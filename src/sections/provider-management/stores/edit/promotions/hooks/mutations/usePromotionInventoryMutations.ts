import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createPromotionInventory,
  updatePromotionInventory,
} from "@/services/promotions";

export function usePromotionInventoryMutations(storeId: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["store-promotions", storeId],
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: ["store-promotions-summary", storeId],
      exact: false,
    });
  };

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await createPromotionInventory(formData);
      if (res.error)
        throw new Error(res.message || res.detail || "Error desconocido");
      return res;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Promoción de inventario creada");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Error al crear promoción inventario"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      promotionId,
      data,
    }: {
      promotionId: number;
      data: FormData;
    }) => {
      const res = await updatePromotionInventory(promotionId, data);
      if (res.error)
        throw new Error(res.message || res.detail || "Error desconocido");
      return res;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Promoción de inventario actualizada");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Error al actualizar promoción inventario"),
  });

  return {
    create: createMutation.mutate,
    createAsync: createMutation.mutateAsync,
    update: updateMutation.mutate,
    updateAsync: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
