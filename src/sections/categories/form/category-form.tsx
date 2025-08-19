"use client";

import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import LoaderButton from "@/components/loaders/loader-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import {
  CategoriesFormData,
  categoriesSchema,
} from "../modals/categories-schema";
import type { z } from "zod";
import { Category } from "@/types/categories";
import { getAllDepartments } from "@/services/department";
import { isValidUrl, urlToFile } from "@/utils/format";
import { createCategory, updateCategory } from "@/services/categories";
import { useRouter } from "next/navigation";
import IconTrash from "@/components/icon/icon-trash";
import { Button } from "@/components/button/button";

interface CategoryFormProps {
  category?: Category;
  submitting?: boolean;
}

export default function CategoryForm({
  category,
  submitting,
}: CategoryFormProps) {
  const [loadingImage, setLoadingImage] = useState(false);
  const router = useRouter();

  type CategoryFormValues = z.input<typeof categoriesSchema>;

  const methods = useForm<CategoryFormValues>({
    resolver: zodResolver(categoriesSchema),
    defaultValues: {
      department: category?.department.id,
      name: category?.name ?? "",
      description: category?.description ?? "",
      image: category?.image ?? undefined,
      isActive: category?.isActive ?? true,
      features: ((category as any)?.features ?? []).map((f: any) => ({
        featureName: f?.featureName ?? "",
        featureDescription: f?.featureDescription ?? "",
        suggestions: Array.isArray(f?.suggestions) ? f.suggestions : [],
        isPrimary: !!f?.isPrimary,
        isRequired: !!f?.isRequired,
      })),
    } as unknown as CategoryFormValues,
  });

  const {
    control,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  useEffect(() => {
    const loadImageAsFile = async () => {
      if (category?.image) {
        try {
          setLoadingImage(true);
          const file = await urlToFile(category.image, "category-image.jpg");
          setValue("image", file);
        } catch {
          setValue("image", category.image);
        } finally {
          setLoadingImage(false);
        }
      }
    };
    loadImageAsFile();
  }, [category?.image, setValue]);

  const handleSubmit = async (data: CategoryFormValues) => {
    try {
      // transformar suggestions a array antes de enviar
      const normalized = {
        ...data,
        features: (data.features || []).map((f: any) => ({
          ...f,
          isPrimary: !!f.isPrimary,
          isRequired: !!f.isRequired,
          suggestions: Array.isArray(f.suggestions)
            ? f.suggestions.filter((s: string) => !!s?.trim())
            : [],
        })),
      } as CategoriesFormData;

      const formData = new FormData();
      if (normalized.image) {
        if (
          typeof normalized.image === "string" &&
          isValidUrl(normalized.image)
        ) {
          try {
            const imageFile = await urlToFile(normalized.image);
            formData.append("image", imageFile);
          } catch {
            toast.error("Error al procesar la imagen desde URL");
            return;
          }
        } else if (normalized.image instanceof File) {
          formData.append("image", normalized.image);
        }
      }
      formData.append("department", String(normalized.department));
      formData.append("name", normalized.name);
      formData.append("description", normalized.description);
      formData.append("isActive", String(normalized.isActive));
      formData.append("features", JSON.stringify(normalized.features));

      const res = category
        ? await updateCategory(category.id, formData)
        : await createCategory(formData);

      if (res?.error) {
        toast.error(res.message || "No se pudo guardar la categoría");
        return;
      }

      toast.success(
        category
          ? "Categoría editada exitosamente"
          : "Categoría creada exitosamente"
      );
      router.push("/dashboard/(catalog)/categories");
    } catch (e: any) {
      toast.error(e?.message || "No se pudo guardar la categoría");
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit}>
      <div className="space-y-4">
        <RHFAutocompleteFetcherInfinity
          name="department"
          label="Departamento"
          required
          onFetch={getAllDepartments}
        />

        <RHFInputWithLabel
          name="name"
          label="Nombre de la Categoría"
          placeholder="Ej: Frutas y Verduras"
          autoFocus
          maxLength={100}
        />

        <RHFInputWithLabel
          name="description"
          label="Descripción"
          placeholder="Descripción detallada de la categoría..."
          maxLength={500}
          rows={4}
          type="textarea"
        />

        <RHFImageUpload
          name="image"
          label="Imagen"
          variant="rounded"
          size="full"
          disabled={loadingImage}
        />

        <RHFCheckbox name="isActive" label="Categoría activa" />

        <div>
          <label className="block font-semibold mb-2">Características</label>
          {fields.map((field, idx) => (
            <div key={field.id} className="border rounded p-4 mb-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RHFInputWithLabel
                  name={`features.${idx}.featureName`}
                  label="Nombre de la característica"
                  required
                />
                <RHFInputWithLabel
                  name={`features.${idx}.featureDescription`}
                  label="Descripción"
                  required
                />
                {/* Sugerencias como array dinámico */}
                <div className="col-span-1 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Sugerencias
                  </label>
                  <ArrayStringField name={`features.${idx}.suggestions`} />
                </div>
              </div>
              {/* Opciones de característica */}
              <div className="flex flex-wrap gap-6 mt-4">
                <RHFCheckbox
                  name={`features.${idx}.isPrimary`}
                  label="¿Principal?"
                />
                <RHFCheckbox
                  name={`features.${idx}.isRequired`}
                  label="¿Obligatoria?"
                />
              </div>
              <div className="text-right mt-3">
                <IconButtonRemove onClick={() => remove(idx)} />
              </div>
            </div>
          ))}
          <Button
            outline
            onClick={() =>
              append({
                featureName: "",
                featureDescription: "",
                suggestions: [],
                isPrimary: false,
                isRequired: false,
              })
            }
          >
            Agregar característica
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <LoaderButton
          type="submit"
          loading={submitting || isSubmitting}
          className="btn btn-primary text-textColor"
        >
          Guardar
        </LoaderButton>
      </div>
    </FormProvider>
  );
}

// Campo de array de strings como inputs dinámicos (useFieldArray)
function ArrayStringField({ name }: { name: string }) {
  const { control, register } = useFormContext<any>();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <input
            className="form-input flex-1"
            placeholder={`Sugerencia #${index + 1}`}
            {...register(`${name}.${index}` as const)}
          />
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => remove(index)}
            title="Eliminar sugerencia"
          >
            <IconTrash />
          </button>
        </div>
      ))}
      <Button outline onClick={() => append("")}>
        Agregar sugerencia
      </Button>
    </div>
  );
}

function IconButtonRemove({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-outline-danger btn-sm p-2 rounded-full"
      title="Eliminar"
    >
      <IconTrash />
    </button>
  );
}
