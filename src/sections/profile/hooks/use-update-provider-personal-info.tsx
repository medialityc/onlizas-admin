import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PersonalInfoFormData } from "@/sections/profile/schemas/personal-info-schema";
import { ApiResponse } from "@/types/fetch/api";
import showToast from "@/config/toast/toastConfig";
import { updateProviderPersonalInfo } from "@/services/users";

interface UseUpdateProviderPersonalInfoOptions {
  onSuccess?: (data: void) => void;
  onError?: (error: Error) => void;
}

export function useUpdateProviderPersonalInfo(
  providerId: string | number,
  options?: UseUpdateProviderPersonalInfoOptions
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PersonalInfoFormData) => {
      const response: ApiResponse<void> = await updateProviderPersonalInfo(
        providerId,
        data
      );

      if (response.error || !response.data) {
        throw new Error(
          response.message || "Error al actualizar información personal"
        );
      }

      return response.data;
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas con el usuario
      queryClient.invalidateQueries({
        queryKey: ["user", "profile", "me", providerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      showToast("Información personal actualizada correctamente", "success");
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error("Error al actualizar información personal:", error);
      showToast(
        error.message || "Error al actualizar información personal",
        "error"
      );
      options?.onError?.(error);
    },
  });
}
