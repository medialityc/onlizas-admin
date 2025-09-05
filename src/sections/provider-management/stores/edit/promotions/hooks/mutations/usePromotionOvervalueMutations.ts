import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createPromotionOvervalue, updatePromotionOvervalue } from "@/services/promotions";

export function usePromotionOvervalueMutations(storeId: number) {
	const queryClient = useQueryClient();

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["store-promotions", storeId], exact: false });
	};

	const createMutation = useMutation({
		mutationFn: async (formData: FormData) => {
			const res = await createPromotionOvervalue(formData);
			if (res.error) throw new Error(res.message || res.detail || "Error desconocido");
			return res;
		},
		onSuccess: () => {
			invalidate();
			toast.success("Promoción sobrevalor creada");
		},
		onError: (err: any) => toast.error(err?.message || "Error al crear promoción sobrevalor"),
	});

	const updateMutation = useMutation({
		mutationFn: async ({ promotionId, data }: { promotionId: number; data: FormData }) => {
			const res = await updatePromotionOvervalue(promotionId, data);
			if (res.error) throw new Error(res.message || res.detail || "Error desconocido");
			return res;
		},
		onSuccess: () => {
			invalidate();
			toast.success("Promoción sobrevalor actualizada");
		},
		onError: (err: any) => toast.error(err?.message || "Error al actualizar promoción sobrevalor"),
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

