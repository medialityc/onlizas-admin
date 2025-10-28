import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createPromotionFree, updatePromotionFree } from "@/services/promotions";

export function usePromotionFreeMutations(storeId: string) { // Cambiado a string para GUIDs
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["store-promotions", storeId], exact: false });
  };

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await createPromotionFree(formData);
      if (res.error) throw new Error(res.message || res.detail || "Error desconocido");
      return res;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Promoción de entrega gratuita creada");
    },
    onError: (err: any) => toast.error(err?.message || "Error al crear promoción free"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ promotionId, data }: { promotionId: number; data: FormData }) => {
      const res = await updatePromotionFree(promotionId, data);
      if (res.error) throw new Error(res.message || res.detail || "Error desconocido");
      return res;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Promoción de entrega gratuita actualizada");
    },
    onError: (err: any) => toast.error(err?.message || "Error al actualizar promoción free"),
  });

  return {
    // expose async variants so callers can await and rely on isPending flags
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
