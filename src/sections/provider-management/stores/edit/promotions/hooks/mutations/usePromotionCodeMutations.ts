import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createPromotionCode, updatePromotionCode } from "@/services/promotions";

export function usePromotionCodeMutations(storeId: string) { // Cambiado a string para GUIDs
	const queryClient = useQueryClient();

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["store-promotions", storeId], exact: false });
	};

	const createMutation = useMutation({
		mutationFn: async (formData: FormData) => {
			const res = await createPromotionCode(formData);
			if (res.error) throw new Error(res.message || res.detail || "Error desconocido");
			return res;
		},
		onSuccess: () => {
			invalidate();
			toast.success("Promoción con código creada");
		},
		onError: (err: any) => toast.error(err?.message || "Error al crear promoción con código"),
	});

	const updateMutation = useMutation({
		mutationFn: async ({ promotionId, data }: { promotionId: number; data: FormData }) => {
			const res = await updatePromotionCode(promotionId, data);
			if (res.error) throw new Error(res.message || res.detail || "Error desconocido");
			return res;
		},
		onSuccess: () => {
			invalidate();
			toast.success("Promoción con código actualizada");
		},
		onError: (err: any) => toast.error(err?.message || "Error al actualizar promoción con código"),
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

