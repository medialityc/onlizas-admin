"use client";

import { AlertBox } from "@/components/alert/alert-box";
import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CategoriesFormData, categoriesSchema } from "./categories-schema";
import { createCategory, updateCategory } from "@/services/categories";
import { Category } from "@/types/categories";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllDepartments } from "@/services/department";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import { urlToFile } from "@/utils/format";

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
  const [loadingImage, setLoadingImage] = useState(false);
  const queryClient = useQueryClient();

  const methods = useForm<CategoriesFormData>({
    resolver: zodResolver(categoriesSchema),
    defaultValues: {
      department: category?.department
        ? {
            id: category?.department.id ?? 0,
            name: category?.department.name ?? "",
          }
        : undefined,
      name: category?.name ?? "",
      description: category?.description ?? "",
      image: category?.image ?? "",
      isActive: category?.isActive ?? true,
    },
  });

  const {
    reset,
    formState: { isSubmitting },
    setValue,
  } = methods;

  // Cargar imagen desde URL cuando se abre para editar
  useEffect(() => {
    const loadImageAsFile = async () => {
      if (category?.image && open) {
        try {
          setLoadingImage(true);
          const file = await urlToFile(category.image, "category-image.jpg");
          setValue("image", file);
        } catch (error) {
          console.warn("No se pudo cargar la imagen:", error);
          // Si falla, mantener la URL como string
          setValue("image", category.image);
        } finally {
          setLoadingImage(false);
        }
      }
    };

    loadImageAsFile();
  }, [category?.image, open, setValue]);

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: CategoriesFormData) => {
    setError(null);
    let response;
    try {
      let imageValue = data.image;
      if (data.image instanceof File) {
        imageValue = category?.image || "";
      }
      const formData = new FormData();
      formData.append("departmentId", data.department.id.toString());
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("image", imageValue);
      formData.append("isActive", data.isActive.toString());
      if (category) {
        response = await updateCategory(category.id, formData);
      } else {
        response = await createCategory(formData);
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
              <RHFAutocompleteFetcherInfinity
                name="department"
                label="Departamento"
                required
                onFetch={getAllDepartments}
              />
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
            <RHFInputWithLabel
              name="description"
              label="Descripción"
              placeholder="Descripción detallada de la categoría..."
              maxLength={500}
              rows={4}
              type="textarea"
            />

            {/* Image URL Input */}
            <RHFImageUpload
              name="image"
              label="Imagen"
              variant="rounded"
              size="full"
              disabled={loadingImage}
            />

            {/* IsActive Checkbox */}
            <RHFCheckbox name="isActive" label="Categoría activa" />
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
