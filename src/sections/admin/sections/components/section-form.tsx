"use client";

import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import LoaderButton from "@/components/loaders/loader-button";
import { Button } from "@/components/button/button";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import RHFDateInput from "@/components/react-hook-form/rhf-date-input";
import { RHFSelect, RHFSwitch } from "@/components/react-hook-form";
import { useSectionCreateForm } from "../hooks/use-section-create-form";
import { SectionFormData } from "../schema/section-schema";
import RHFColorPicker from "@/components/react-hook-form/rhf-color-picker";
import SectionProducts from "./section-products-form/section-products";
import {
  TARGET_USER_DEVICE_OPTIONS,
  TARGET_USER_SEGMENT_OPTIONS,
  TEMPLATE_TYPE_ENUM_OPTIONS,
} from "../constants/section.options";
import { usePermissions } from "zas-sso-client";

interface Props {
  initValue?: SectionFormData;
}

export default function SectionForm({ initValue }: Props) {
  const { form, isPending, onSubmit, startDate } =
    useSectionCreateForm(initValue);
  const { push } = useRouter();
  const handleCancel = useCallback(
    () => push("/dashboard/content/sections"),
    [push]
  );

  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every((perm) =>
      permissions.some((p) => p.code === perm)
    );
  };
  const canSave = initValue ? hasPermission(["UpdateSection"]) : hasPermission(["CreateSection"]);

  return (
    <section className="w-full px-2 sm:px-4 py-6">
      <FormProvider methods={form} onSubmit={onSubmit} id="section-form">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Card 1: Info principal */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-6 flex flex-col gap-4 col-span-1 md:col-span-2 xl:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <RHFInputWithLabel
                name="name"
                label="Nombre de sección"
                placeholder="Ej: Productos destacados"
                autoFocus
                maxLength={100}
              />
              <RHFInputWithLabel
                name="description"
                label="Descripción"
                multiple
                autoFocus
                min={4}
                maxLength={255}
              />
              <RHFInputWithLabel
                name="viewMoreUrl"
                label="Url"
                placeholder="Ej: /products/view-more"
                maxLength={50}
              />
              <RHFInputWithLabel
                name="displayOrder"
                label="Orden de visualización"
                placeholder="Ej: 1,2,3"
                type="number"
              />
              <RHFSelect
                label="Tipo de plantilla"
                name="templateType"
                options={TEMPLATE_TYPE_ENUM_OPTIONS}
                required
                size="small"
              />
              <RHFInputWithLabel
                name="defaultItemCount"
                label="Cantidad de elementos por defecto"
                placeholder="Ej: 10,20,30"
                type="number"
              />
              <RHFSelect
                options={TARGET_USER_SEGMENT_OPTIONS}
                name="targetUserSegment"
                label="Segmento de usuarios"
                placeholder="Ej: Jóvenes, Adultos"
                autoFocus
              />
              <RHFSelect
                options={TARGET_USER_DEVICE_OPTIONS}
                name="targetDeviceType"
                label="Tipo de dispositivo"
                placeholder="Ej: Móvil, Escritorio"
                autoFocus
              />
            </div>
          </div>

          {/* Card 2: Fechas y colores */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-6 flex flex-col gap-4 col-span-1 md:col-span-2 xl:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RHFDateInput
                minDate={new Date()}
                name="startDate"
                label="Fecha de inicio"
              />
              <RHFDateInput
                minDate={new Date(startDate)}
                name="endDate"
                label="Fecha de expiración"
              />
              <RHFColorPicker name="backgroundColor" label="Color de banner" />
              <RHFColorPicker name="textColor" label="Color de texto" />
            </div>
          </div>

          {/* Card 3: Switches */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-6 flex flex-col gap-4 col-span-1 md:col-span-2 xl:col-span-3">
            <div className="flex flex-col sm:flex-row gap-4">
              <RHFSwitch name="isActive" label="Sección activa" />
              <RHFSwitch name="isPersonalized" label="Sección personalizada" />
            </div>
          </div>

          {/* Card 4: Productos */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-6 flex flex-col gap-4 col-span-1 md:col-span-2 xl:col-span-3">
            <SectionProducts />
          </div>
        </div>
      </FormProvider>

      {/* actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
        <Button
          type="button"
          variant="secondary"
          outline
          onClick={handleCancel}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        {canSave && (
          <LoaderButton
            type="submit"
            form="section-form"
            loading={isPending}
            disabled={isPending}
            className="btn btn-primary w-full sm:w-auto"
          >
            Guardar
          </LoaderButton>
        )}
      </div>
    </section>
  );
}
