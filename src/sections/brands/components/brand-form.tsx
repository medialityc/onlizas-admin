"use client";

import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import LoaderButton from "@/components/loaders/loader-button";
import { BrandFormData } from "../schemas/brand-schema";
import { useBrandCreateForm } from "../hooks/use-brand-create-form";
import { Button } from "@/components/button/button";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { usePermissions } from "@/hooks/use-permissions";

interface BrandFormProps {
  initValue?: BrandFormData;
}

/** Permisos que permiten guardar/crear marcas (admin o proveedor) */
const SAVE_BRAND_PERMS = [PERMISSION_ENUM.CREATE, PERMISSION_ENUM.SUPPLIER_CREATE];

export default function BrandForm({ initValue }: BrandFormProps) {
  const { form, isPending, onSubmit } = useBrandCreateForm(initValue);
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission(SAVE_BRAND_PERMS);

  const { push } = useRouter();
  const handleCancel = useCallback(() => push("/dashboard/brands"), [push]);

  return (
    <section>
      <FormProvider methods={form} onSubmit={onSubmit} id="brand-form">
        <div className="space-y-4">
          <RHFInputWithLabel
            name="name"
            label="Nombre de la Marca"
            placeholder="Ej: Acme"
            autoFocus
            maxLength={100}
          />
        </div>
      </FormProvider>

      <div className="flex justify-end gap-3 pt-6">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        {hasUpdatePermission && (
          <LoaderButton
            type="submit"
            form="brand-form"
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
