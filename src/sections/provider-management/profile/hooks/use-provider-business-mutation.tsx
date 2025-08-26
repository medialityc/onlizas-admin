"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Business } from "@/types/business";
import { CreateSchemaBusiness } from "@/sections/business/modals/business-schema";
import {
  updateBusinessProviderData,
  createBusinessBySupplier,
} from "@/services/business";
import { isValidUrl, urlToFile } from "@/utils/format";

interface UseProviderBusinessMutationProps {
  business?: Business;
  userId?: number;
  onSuccess?: (data?: Business) => void;
  onClose?: () => void;
}

export function useProviderBusinessMutation({
  business,
  userId,
  onSuccess,
  onClose,
}: UseProviderBusinessMutationProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateSchemaBusiness) => {
      // Validación específica para provider: si no hay userId, mostrar error
      if (!userId && !business) {
        throw new Error(
          "No se puede crear un negocio sin asociar a un usuario"
        );
      }

      const formData = new FormData();

      // Mapear campos base
      formData.append("name", data.name);
      formData.append("code", data.code);
      formData.append("description", data.description || "");
      formData.append("hblInitial", data.hblInitial);
      formData.append("address", data.address || "");
      formData.append("email", data.email || "");
      formData.append("phone", data.phone || "");
      formData.append("isPrimary", data.isPrimary ? "true" : "false");
      formData.append("fixedRate", data.fixedRate?.toString() || "0");
      formData.append("invoiceText", data.invoiceText || "");
      formData.append("locationId", data.locationId.toString());

      if (data.parentId) {
        formData.append("parentId", data.parentId.toString());
      }

      // Manejo de imágenes
      if (data.photoObjectCodes && data.photoObjectCodes.length > 0) {
        await Promise.all(
          data.photoObjectCodes.map(async (photo, index) => {
            if (typeof photo === "string" && isValidUrl(photo)) {
              try {
                const imageFile = await urlToFile(photo);
                formData.append(`photoObjectCodes[${index}]`, imageFile);
              } catch {
                toast.error(`Error al procesar la imagen desde URL (${photo})`);
              }
            } else if (photo instanceof File) {
              formData.append(`photoObjectCodes[${index}]`, photo);
            }
          })
        );
      }

      let response;

      if (business) {
        // Editando business existente
        response = await updateBusinessProviderData(business.id, formData);

        if (response.error) {
          const errorMsg =
            response.status === 409
              ? "Ya existe un negocio con ese código"
              : response.message || "No se pudo procesar este negocio";
          throw new Error(errorMsg);
        }

        return { type: "edit", data: { name: data.name, code: data.code } };
      } else {
        // Creando nuevo business
        response = await createBusinessBySupplier(formData);

        if (response.error) {
          const errorMsg =
            response.status === 409
              ? "Ya existe un negocio con ese código"
              : response.message || "No se pudo crear este negocio";
          throw new Error(errorMsg);
        }

        return { type: "create", data: response.data };
      }
    },
    onSuccess: (result) => {
      // Invalidar la query correcta que usa useBusiness
      queryClient.invalidateQueries({
        queryKey: ["user", "profile", "business"],
      });

      // Invalidar queries adicionales relacionadas con business
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

      // Llamar callbacks
      if (result.type === "edit") {
        onSuccess?.(result.data as Business);
        toast.success("Negocio editado exitosamente");
      } else {
        onSuccess?.();
        toast.success("Negocio creado exitosamente");
      }

      onClose?.();
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
