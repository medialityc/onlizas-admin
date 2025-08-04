"use client";

import { AlertBox } from "@/components/alert/alert-box";
import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CategoriesFormData, categoriesSchema } from "./categories-schema";
import { createCategory, updateCategory } from "@/services/categories";
import { Category } from "@/types/categories";

interface CategoriesModalProps {
  open: boolean;
  onClose: () => void;
  category?: Category; // Opcional si se usa para editar
  loading: boolean;
  onSuccess?: () => void; // Opcional si se usa para editar
}

export default function CategoriesModal({
  open,
  onClose,
  category,
  loading,
  onSuccess,
}: CategoriesModalProps) {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const methods = useForm<CategoriesFormData>({
    resolver: zodResolver(categoriesSchema),
    defaultValues: {
      department: {
        id: category?.department.id ?? 0,
        name: category?.department.name ?? "",
      },
      name: category?.name ?? "",
      description: category?.description ?? "",
      image: category?.image ?? "",
      isActive: category?.isActive ?? true,
    },
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: CategoriesFormData) => {
    setError(null);
    let response;
    try {
      const body = {
        departmentId: data.department.id,
        name: data.name,
        description: data.description,
        image: data.image,
        isActive: data.isActive,
      };
      if (category) {
        response = await updateCategory(category.id, body);
      } else {
        response = await createCategory(body);
      }

      if (!response.error) {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        onSuccess?.();
        reset();
        toast.success(
          category
            ? "Categoría editada exitosamente"
            : "Categoría creada exitosamente"
        );
        handleClose();
      } else {
        if (response.status === 409) {
          toast.error("Ya existe una categoría con ese nombre");
        } else {
          toast.error(response.message || "No se pudo procesar la categoría");
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar la categoría";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading}
      title={category ? "Editar Categoría" : "Crear Nueva Categoría"}
    >
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <AlertBox title="Error" variant="danger" message={error} />
          </div>
        )}

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="space-y-4">
            {/* Department Select/Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Departamento *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <RHFInputWithLabel
                  name="department.id"
                  label="ID Departamento"
                  type="number"
                  placeholder="1"
                />
                <RHFInputWithLabel
                  name="department.name"
                  label="Nombre Departamento"
                  placeholder="Ej: Alimentos"
                />
              </div>
            </div>

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
            <RHFInputWithLabel
              name="image"
              label="URL de la Imagen"
              placeholder="https://ejemplo.com/imagen.jpg"
              type="url"
            />

            {/* IsActive Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...methods.register("isActive")}
                id="isActive"
                className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Categoría activa
              </label>
              {methods.formState.errors.isActive && (
                <div className="text-red-500 text-sm">
                  {methods.formState.errors.isActive.message}
                </div>
              )}
            </div>
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
              className="btn btn-primary text-textColor"
            >
              {category ? "Editar" : "Crear"} Categoría
            </LoaderButton>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
