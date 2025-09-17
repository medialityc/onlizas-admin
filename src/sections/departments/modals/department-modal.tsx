"use client";

import { AlertBox } from "@/components/alert/alert-box";
import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { DepartmentFormData, departmentSchema } from "./department-schema";
import { Department } from "@/types/departments";
import { createDepartment, updateDepartment } from "@/services/department";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import { urlToFile, isValidUrl } from "@/utils/format";
import { processImageFile } from "@/utils/image-helpers";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  department?: Department; // Opcional si se usa para editar
  loading: boolean;
  onSuccess?: () => void; // Opcional si se usa para editar
}

export default function DepartmentModal({
  open,
  onClose,
  department,
  loading,
  onSuccess,
}: ModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const queryClient = useQueryClient();

  const methods = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      description: department?.description ?? "",
      image: department?.image,
      isActive: department?.isActive ?? true,
      name: department?.name ?? "",
    },
  });

  useEffect(() => {
    const loadImageFromUrl = async () => {
      if (department?.image && isValidUrl(department.image)) {
        setLoadingImage(true);
        try {
          const imageFile = await urlToFile(department.image);
          methods.setValue("image", imageFile);
        } catch (error) {
          console.error("Error loading image from URL:", error);
          // No mostrar toast aquí ya que es una carga inicial
        } finally {
          setLoadingImage(false);
        }
      }
    };

    if (open && department?.image) {
      loadImageFromUrl();
    }
  }, [open, department?.image, methods]);

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: DepartmentFormData) => {
    setError(null);
    let response;
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("isActive", String(data.isActive));

      // Procesar imagen
      if (data.image) {
        const processedImage = await processImageFile(data.image);
        if (processedImage) {
          formData.append("image", processedImage);
        } else {
          toast.error("Error al procesar la imagen");
        }
      }

      if (department) {
        response = await updateDepartment(department.id, formData);
      } else {
        response = await createDepartment(formData);
      }

      if (!response.error) {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        onSuccess?.();
        reset();
        toast.success(
          department
            ? "Departamento editado exitosamente"
            : "Departamento creado exitosamente"
        );
        handleClose();
      } else {
        if (response.status === 409) {
          toast.error("Ya existe un departamento con ese nombre");
        } else {
          toast.error(
            response.message || "No se pudo procesar el departamento"
          );
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al procesar el departamento";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading}
      title={department ? "Editar Departamento" : "Crear Nuevo Departamento"}
    >
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <AlertBox title="Error" variant="danger" message={error} />
          </div>
        )}

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="space-y-4 w-full">
            {/* Name Input */}
            <RHFInputWithLabel
              name="name"
              label="Nombre de la Categoría"
              placeholder="Ej: Frutas y Verduras"
              autoFocus
              maxLength={100}
            />

            {/* Description Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción *
              </label>
              <div className="relative">
                <textarea
                  {...methods.register("description")}
                  placeholder="Descripción detallada de la categoría..."
                  maxLength={500}
                  rows={4}
                  className="form-textarea"
                />
                {methods.formState.errors.description && (
                  <div className="text-red-500 text-sm mt-1">
                    {methods.formState.errors.description.message}
                  </div>
                )}
              </div>
            </div>

            {/* Image URL Input */}
            <div className="relative">
              <RHFImageUpload
                name="image"
                label="URL de la Imagen"
                variant="rounded"
                size="full"
                disabled={loadingImage}
              />
              {loadingImage && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    <span>Cargando imagen...</span>
                  </div>
                </div>
              )}
            </div>

            {/* IsActive Checkbox */}
            <RHFCheckbox
              name="isActive"
              id="isActive"
              label="¿Está activo?"
              className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-outline-secondary"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <LoaderButton
              type="submit"
              loading={isSubmitting}
              className="btn btn-primary"
            >
              {department ? "Editar" : "Crear"} Departamento
            </LoaderButton>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
