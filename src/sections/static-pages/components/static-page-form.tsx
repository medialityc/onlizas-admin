"use client";

import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import RHFHTMLEditor from "@/components/react-hook-form/rhf-html-editor";
import LoaderButton from "@/components/loaders/loader-button";
import { Button } from "@/components/button/button";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { usePermissions } from "@/hooks/use-permissions";
import { StaticPageFormData } from "../schemas/static-page-schema";
import { useStaticPageForm } from "../hooks/use-static-page-form";

interface StaticPageFormProps {
  initValue?: StaticPageFormData;
}

const SECTION_OPTIONS = [
  { value: 0, label: "Ayuda" },
  { value: 1, label: "Sobre nosotros" },
  { value: 2, label: "Legal" },
  { value: 3, label: "Política de privacidad" },
];

export default function StaticPageForm({ initValue }: StaticPageFormProps) {
  const { form, isPending, onSubmit } = useStaticPageForm(initValue);
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);

  const { push } = useRouter();
  const handleCancel = useCallback(
    () => push("/dashboard/content/static-pages"),
    [push],
  );

  const isEdit = !!initValue?.id;

  return (
    <section>
      <FormProvider methods={form} onSubmit={onSubmit} id="static-page-form">
        <div className="space-y-4">
          <RHFInputWithLabel
            name="title"
            label="Título de la Página"
            placeholder="Ej: Términos y Condiciones"
            autoFocus
            maxLength={200}
          />

          <RHFInputWithLabel
            name="slug"
            label="Slug (URL)"
            placeholder="Ej: terminos-y-condiciones"
            maxLength={120}
            disabled={isEdit}
            underLabel="El slug no puede modificarse luego de crear la página"
          />

          <RHFSelectWithLabel
            name="section"
            label="Sección"
            placeholder="Selecciona una sección"
            options={SECTION_OPTIONS}
            required
          />

          <div className="pt-2">
            <RHFHTMLEditor
              name="content"
              label="Contenido HTML"
              showToolbar
              showPreview
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInputWithLabel
              name="metaDescription"
              type="textarea"
              label="Meta Descripción (SEO)"
              placeholder="Descripción para buscadores"
              rows={4}
            />
            <RHFInputWithLabel
              name="metaKeywords"
              type="textarea"
              label="Meta Keywords (SEO)"
              placeholder="Ej: términos, condiciones, legal"
              rows={4}
            />
          </div>
        </div>
      </FormProvider>

      <div className="flex justify-end gap-3 pt-6">
        <Button type="button" variant="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
        {hasUpdatePermission && (
          <LoaderButton
            type="submit"
            form="static-page-form"
            loading={isPending}
            disabled={isPending}
            className="btn btn-primary"
          >
            Guardar
          </LoaderButton>
        )}
      </div>
    </section>
  );
}
