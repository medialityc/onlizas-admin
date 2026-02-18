"use client";

import React from "react";
import SimpleModal from "@/components/modal/modal";
import { FormProvider as RHFFormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RHFInputWithLabel,
  RHFSelectWithLabel,
  RHFFileUpload,
} from "@/components/react-hook-form";
import RHFDatePicker from "@/components/react-hook-form/rhf-date-picker";
import LoaderButton from "@/components/loaders/loader-button";
import { HomeBannerSchema, type HomeBannerForm } from "./banner-schema";
import RHFDateInput from "@/components/react-hook-form/rhf-date-input";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (banner: HomeBannerForm) => void;
};

export default function HomeBannerCreateModal({
  open,
  onClose,
  onCreate,
}: Props) {
  const methods = useForm<HomeBannerForm>({
    resolver: zodResolver(HomeBannerSchema) as any,
    defaultValues: {
      title: "",
      url: "",
      position: "hero",
      startDate: undefined,
      endDate: undefined,
      image: null,
      active: true,
    },
    mode: "onBlur",
  });

  const submitOnly = (data: HomeBannerForm) => {
    onCreate(data);
    onClose();
  };

  return (
    <SimpleModal open={open} onClose={onClose} title="Crear Nuevo HomeBanner">
      <RHFFormProvider {...methods}>
        <div className="grid grid-cols-1 gap-4">
          <RHFInputWithLabel
            name="title"
            label="Título"
            placeholder="Título del banner"
          />
          <RHFInputWithLabel
            name="url"
            label="URL de Destino"
            placeholder="/productos/ofertas"
          />
          <RHFSelectWithLabel
            name="position"
            label="Posición"
            options={[
              { label: "Hero (Principal)", value: "hero" },
              { label: "Sidebar", value: "sidebar" },
              { label: "Slideshow", value: "slideshow" },
            ]}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RHFDateInput name="startDate" label="Fecha de Inicio" />
            <RHFDateInput name="endDate" label="Fecha de Fin" />
          </div>
          <RHFFileUpload name="image" label="Imagen del HomeBanner" />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <LoaderButton
            type="button"
            className="btn btn-dark"
            onClick={() => methods.handleSubmit(submitOnly)()}
          >
            Crear
          </LoaderButton>
        </div>
      </RHFFormProvider>
    </SimpleModal>
  );
}
