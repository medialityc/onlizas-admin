import { extendApprovalProcess } from "@/services/approval-processes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import showToast from "@/config/toast/toastConfig";

/**
 * Hook para manejar solicitudes de extensión de proceso de aprobación.
 * Centraliza la lógica de armado de FormData, mutación, manejo de estados y notificaciones.
 */
export function useApprovalProcessRequest(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  /**
   * Construye el FormData y llama a la API extendApprovalProcess
   * @param userApprovalProcessId - ID del proceso de aprobación
   * @param data - Datos del formulario (categorías, expiración, documentos, comentarios)
   * @returns Promise
   */
  const sendApprovalRequest = async (
    userApprovalProcessId: number,
    data: any
  ) => {
    const formData = new FormData();
    formData.append(
      "approvalProcessId",
      userApprovalProcessId?.toString() || "0"
    );
    if (data.extendCategories) {
      data.categoryIds?.forEach((id: any) =>
        formData.append("categoryIds", id.toString())
      );
      formData.append("extendCategories", "true");
    }
    if (data.extendExpiration) {
      formData.append(
        "newExpirationDate",
        data.newExpirationDate.toISOString()
      );
      formData.append("extendExpiration", "true");
    }
    if (data.documentNames?.length ?? 0 > 0) {
      data.documentNames?.forEach((name: string) =>
        formData.append("documentNames", name)
      );
      data.contents?.forEach((content: any) => {
        if (content instanceof File) {
          formData.append("contents", content);
        } else {
          formData.append(
            "contents",
            new Blob([content], { type: "text/plain" })
          );
        }
      });
    }
    if (data.comments) {
      formData.append("comments", data.comments);
    }
    return extendApprovalProcess(userApprovalProcessId || 0, formData);
  };

  /**
   * Mutation para manejar solicitudes de extensión con estados y notificaciones
   */
  const extendApprovalMutation = useMutation({
    mutationFn: (params: { userApprovalProcessId: number; data: any }) =>
      sendApprovalRequest(params.userApprovalProcessId, params.data),
    onSuccess: () => {
      showToast("Solicitud enviada exitosamente", "success");
      queryClient.invalidateQueries({
        queryKey: ["supplier-approval-process"],
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      showToast(error.message || "Error al enviar la solicitud", "error");
    },
  });

  /**
   * Función para enviar solicitud de categorías
   */
  const submitCategoryRequest = (userApprovalProcessId: number, data: any) => {
    const categoryIds = data.categoryIds.map((id: string) => parseInt(id));
    extendApprovalMutation.mutate({
      userApprovalProcessId,
      data: {
        extendCategories: true,
        categoryIds,
        documentNames: data.documentNames,
        contents: data.contents,
        comments: data.comments,
      },
    });
  };

  /**
   * Función para enviar solicitud de extensión de expiración
   */
  const submitExpirationExtension = (
    userApprovalProcessId: number,
    data: any
  ) => {
    extendApprovalMutation.mutate({
      userApprovalProcessId,
      data: {
        extendExpiration: true,
        newExpirationDate: data.newExpirationDate,
        documentNames: data.documentNames,
        contents: data.contents,
        comments: data.comments,
      },
    });
  };

  return {
    submitCategoryRequest,
    submitExpirationExtension,
    isLoading: extendApprovalMutation.isPending,
  };
}
