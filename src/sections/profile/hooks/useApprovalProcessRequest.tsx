import { useMutation, useQueryClient } from "@tanstack/react-query";
import showToast from "@/config/toast/toastConfig";
import { extendApprovalProcess } from "@/services/approval-processes";

/**
 * Hook para manejar solicitudes de extensión de proceso de aprobación.
 * Centraliza la lógica de armado de FormData, mutación, manejo de estados y notificaciones.
 */
export function useApprovalProcessRequest(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  /**
   * Construye el FormData y llama a la API extendApprovalProcess
   * @param approvalProcessId - ID del proceso de aprobación
   * @param data - Datos del formulario (categorías, expiración, documentos, comentarios)
   * @returns Promise
   */
  const sendApprovalRequest = async (
    approvalProcessId: string | number,
    data: any
  ) => {
    const formData = new FormData();

    // approvalProcessId
    formData.append("approvalProcessId", approvalProcessId.toString() );

    // Extender categorías
    if (data.extendCategories) {
      if (Array.isArray(data.categoryIds)) {
        data.categoryIds.forEach((id: string | number) =>
          formData.append("categoryIds", String(id))
        );
      }
      formData.append("extendCategories", "true");
    }

    // Extender expiración
    if (data.extendExpiration && data.newExpirationDate) {
      formData.append(
        "newExpirationDate",
        data.newExpirationDate instanceof Date
          ? data.newExpirationDate.toISOString()
          : String(data.newExpirationDate)
      );
      formData.append("extendExpiration", "true");
    }

    // Archivos y nombres de documentos
    if (Array.isArray(data.documentNames) && data.documentNames.length > 0) {
      data.documentNames.forEach((name: string) =>
        formData.append("documentNames", name)
      );
    }

    if (Array.isArray(data.contents) && data.contents.length > 0) {
      data.contents.forEach((content: File | string) => {
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

    // Comentarios
    if (data.comments) {
      formData.append("comments", String(data.comments));
    }

    return extendApprovalProcess( formData);
  };

  /**
   * Mutation para manejar solicitudes de extensión con estados y notificaciones
   */
  const { mutate, isPending } = useMutation({
    mutationFn: async (params: {
      approvalProcessId?: number|string;
      data: any;
    }) => {
      if (!params.approvalProcessId) {
        throw Error("El ID del proceso de aprobación es obligatorio");
      }
      const res = await sendApprovalRequest(
        params.approvalProcessId,
        params.data
      );
      if (res.error) {
        throw Error(res.message);
      }
      return res;
    },
    onSuccess: () => {
      showToast("Solicitud enviada exitosamente", "success");
      queryClient.invalidateQueries({
        queryKey: ["supplier-approval-process"],
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      console.log({ error });
      showToast(error.message || "Error al enviar la solicitud", "error");
    },
  });

  /**
   * Función para enviar solicitud de categorías o expiracion
   */
  const submitApprovalRequest = (
    approvalProcessId: number|string | undefined,
    data: any,
    type: "category" | "expiration"
  ) => {
    const payload =
      type === "category"
        ? {
            extendCategories: true,
            categoryIds: data.categoryIds?.map((id: string) => parseInt(id)),
            documentNames: data.documentNames,
            contents: data.contents,
            comments: data.comments,
          }
        : {
            extendExpiration: true,
            newExpirationDate: data.newExpirationDate,
            documentNames: data.documentNames,
            contents: data.contents,
            comments: data.comments,
          };

    return mutate({
      approvalProcessId,
      data: payload,
    });
  };

  return {
    submitApprovalRequest,
    isLoading: isPending,
  };
}
