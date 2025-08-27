import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteBusinessBySupplier } from "@/services/business";

interface UseProviderBusinessDeleteMutationProps {
  userId?: number;
  onSuccess?: () => void;
}

export function useProviderBusinessDeleteMutation({
  userId,
  onSuccess,
}: UseProviderBusinessDeleteMutationProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (businessId: string | number) => {
      const response = await deleteBusinessBySupplier(businessId);

      if (response.error) {
        const errorMsg = response.message || "No se pudo eliminar el negocio";
        throw new Error(errorMsg);
      }

      return response.data;
    },
    onSuccess: () => {
      // Invalidar las queries relacionadas con business
      queryClient.invalidateQueries({
        queryKey: ["user", "profile", "business"],
      });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });

      if (userId) {
        queryClient.invalidateQueries({
          queryKey: ["user", "businesses", userId],
        });
        queryClient.invalidateQueries({
          queryKey: ["business", "user", userId],
        });
        queryClient.invalidateQueries({
          queryKey: ["user", "profile", "me"],
        });
      }

      toast.success("Negocio eliminado exitosamente");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
  };
}
