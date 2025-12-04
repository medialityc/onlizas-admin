import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createPromotionXGetY,
  updatePromotionGetY,
} from "@/services/promotions";

export function usePromotionXGetYMutations(storeId: string) {
  // Cambiado a string para GUIDs
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
      const res = await createPromotionXGetY(formData);
      if (res.error)
        throw new Error(res.message || res.detail || "Error desconocido");
      return res;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Promoción de tipo X-get-Y creada");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Error al crear promoción X-get-Y"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      promotionId,
      data,
    }: {
      promotionId: string;
      data: FormData;
    }) => {
      const res = await updatePromotionGetY(promotionId, data);
      if (res.error)
        throw new Error(res.message || res.detail || "Error desconocido");
      return res;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Promoción X-get-Y actualizada");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Error al actualizar promoción X-get-Y"),
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
