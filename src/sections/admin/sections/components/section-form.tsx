"use client";

import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";

import LoaderButton from "@/components/loaders/loader-button";
import { Button } from "@/components/button/button";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import { getAllStores } from "@/services/stores";
import RHFDateInput from "@/components/react-hook-form/rhf-date-input";
import { RHFCheckbox, RHFSelect } from "@/components/react-hook-form";
import { useSectionCreateForm } from "../hooks/use-section-create-form";
import { SectionFormData } from "../schema/section-schema";
import { TEMPLATE_TYPE_ENUM } from "@/types/section";
import RHFColorPicker from "@/components/react-hook-form/rhf-color-picker";

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

  const templateTypeOptions: { value: TEMPLATE_TYPE_ENUM; label: string }[] = [
    { value: TEMPLATE_TYPE_ENUM.BANNER, label: "HomeBanners" },
    { value: TEMPLATE_TYPE_ENUM.PRODUCT, label: "Productos" },
    { value: TEMPLATE_TYPE_ENUM.CRITERIA, label: "Criterios" },
  ];

  return (
    <section>
      <FormProvider methods={form} onSubmit={onSubmit} id="section-form">
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <div className="col-span-1">
            <RHFAutocompleteFetcherInfinity
              name="storeId"
              label="Tienda"
              required
              onFetch={getAllStores}
            />
          </div>

          <div className="col-span-1">
            <RHFInputWithLabel
              name="name"
              label="Nombre de sección"
              placeholder="Ej: Productos destacados"
              autoFocus
              maxLength={100}
            />
          </div>
          <div className="col-span-1">
            <RHFSelect
              options={[
                { value: "ALL", label: "Todos" },
                { value: "YOUNG", label: "Jóvenes" },
                { value: "ADULT", label: "Adultos" },
              ]}
              name="targetUserSegment"
              label="Segmento de usuarios"
              placeholder="Ej: Jóvenes, Adultos"
              autoFocus
            />
          </div>
          <div className="col-span-1">
            <RHFSelect
              options={[
                { value: "MOBILE", label: "Móvil" },
                { value: "DESKTOP", label: "Escritorio" },
              ]}
              name="targetDeviceType"
              label="Tipo de dispositivo"
              placeholder="Ej: Móvil, Escritorio"
              autoFocus
            />
          </div>
          <div className="col-span-1">
            <RHFInputWithLabel
              name="description"
              label="Descripción"
              multiple
              autoFocus
              min={4}
              maxLength={255}
            />
          </div>

          <div className="col-span-1">
            <RHFInputWithLabel
              name="viewMoreUrl"
              label="Url"
              placeholder="Ej: /products/view-more"
              maxLength={50}
            />
          </div>

          <div className="col-span-1">
            <RHFInputWithLabel
              name="displayOrder"
              label="Orden de visualización"
              placeholder="Ej: 1,2,3"
              type="number"
            />
          </div>

          <div className="col-span-1">
            <RHFSelect
              label="Tipo de plantilla"
              name="templateType"
              options={templateTypeOptions}
              required
              size="small"
            />
          </div>

          <div className="col-span-1">
            <RHFInputWithLabel
              name="defaultItemCount"
              label="Cantidad de elementos por defecto"
              placeholder="Ej: 10,20,30"
              type="number"
            />
          </div>
          <div className="col-span-1">
            <RHFColorPicker name="backgroundColor" label="Color de banner" />
          </div>
          <div className="col-span-1">
            <RHFColorPicker name="textColor" label="Color de texto" />
          </div>

          <div className="col-span-1">
            <RHFDateInput
              minDate={new Date()}
              name="startDate"
              label="Fecha de inicio"
            />
          </div>
          <div className="col-span-1">
            <RHFDateInput
              minDate={new Date(startDate)}
              name="endDate"
              label="Fecha de expiración"
            />
          </div>
          <div className="col-span-1  ">
            <RHFCheckbox name="isActive" label="Sección activa" />{" "}
          </div>
          <div className="col-span-1  ">
            <RHFCheckbox
              name="isPersonalized"
              label="Categoría personalizada"
            />
          </div>
          <div className="col-span-1">
            <RHFImageUpload
              name="desktopImage"
              label="Imagen para computadoras"
              variant="rounded"
              size="full"
              cropDimensions={{
                height: 557,
                width: 1920,
              }}
            />
          </div>
          <div className="col-span-1">
            <RHFImageUpload
              name="mobileImage"
              label="Imagen para dispositivos mobiles"
              variant="rounded"
              size="full"
              cropDimensions={{
                height: 730,
                width: 470,
              }}
            />
          </div>
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
        <LoaderButton
          type="submit"
          form="section-form"
          loading={isPending}
          disabled={isPending}
          className="btn btn-primary "
        >
          Guardar
        </LoaderButton>
      </div>
    </section>
  );
}
