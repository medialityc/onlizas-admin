"use client";

import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import LoaderButton from "@/components/loaders/loader-button";
import { CategoryFormData } from "../schemas/category-schema";
import { getAllDepartments } from "@/services/department";
import { useCategoryCreateForm } from "../hooks/use-category-create-form";
import CategoryFeatureSection from "./category-features.section";
import { Button } from "@/components/button/button";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { usePermissions } from "@/hooks/use-permissions";

interface CategoryFormProps {
  initValue?: CategoryFormData;
}

export default function CategoryForm({ initValue }: CategoryFormProps) {
  const { form, isPending, onSubmit } = useCategoryCreateForm(initValue);
  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);

  const { push } = useRouter();
  const handleCancel = useCallback(() => push("/dashboard/categories"), [push]);

  return (
    <section>
      <FormProvider methods={form} onSubmit={onSubmit} id="category-from">
        <div className="space-y-4">
          <RHFAutocompleteFetcherInfinity
            name="departmentId"
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
          />

          <RHFCheckbox name="active" label="Categoría activa" />

          <CategoryFeatureSection />
        </div>
      </FormProvider>

      {/* actions */}
      <div className="flex justify-end gap-3 pt-6">
        <Button
          type="button"
          variant="secondary"
          outline
          onClick={handleCancel}
        >
          Cancelar
        </Button>
        {hasUpdatePermission && (
          <LoaderButton
            type="submit"
            form="category-from"
            loading={isPending}
            disabled={isPending}
            className="btn btn-primary "
          >
            Guardar
          </LoaderButton>
        )}
      </div>
    </section>
  );
}
