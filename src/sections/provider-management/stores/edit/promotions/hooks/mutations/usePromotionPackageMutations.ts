import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createPromotionPackage, updatePromotionPackage } from "@/services/promotions";

export function usePromotionPackageMutations(storeId: number) {
	const queryClient = useQueryClient();

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["store-promotions", storeId], exact: false });
	};

	const createMutation = useMutation({
		mutationFn: async (formData: FormData) => {
			const res = await createPromotionPackage(formData);
			if (res.error) throw new Error(res.message || res.detail || "Error desconocido");
			return res;
		},
		onSuccess: () => {
			invalidate();
			toast.success("Promoción de paquete creada");
		},
		onError: (err: any) => toast.error(err?.message || "Error al crear promoción paquete"),
	});

	const updateMutation = useMutation({
		mutationFn: async ({ promotionId, data }: { promotionId: number; data: FormData }) => {
			const res = await updatePromotionPackage(promotionId, data);
			if (res.error) throw new Error(res.message || res.detail || "Error desconocido");
			return res;
		},
		onSuccess: () => {
			invalidate();
			toast.success("Promoción de paquete actualizada");
		},
		onError: (err: any) => toast.error(err?.message || "Error al actualizar promoción paquete"),
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

