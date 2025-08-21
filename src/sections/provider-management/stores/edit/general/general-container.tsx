"use client";

import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Store } from "@/types/stores";
import { RHFInputWithLabel, RHFSwitch, RHFFileUpload } from "@/components/react-hook-form";
import LoaderButton from "@/components/loaders/loader-button";
import { toast } from "react-toastify";
import { updateStore } from "@/services/stores";
import { isValidUrl, urlToFile } from "@/utils/format";

interface Props {
  store: Store;
}

export default function GeneralContainer({ store }: Props) {
  const { handleSubmit, formState, reset, clearErrors } = useFormContext();

  useEffect(() => {
    const s = store as any;
    const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));
    // Normalizar valores nulos/indefinidos a string vacío para evitar errores de Zod
    reset({
      isActive: Boolean(s.isActive ?? true),
      name: str(s.name),
      description: str(s.description),
      url: str(s.url),
      // Mantener URL del logo como string para mostrar "Documento existente"
      logoStyle: str(s.logoStyle),
      email: str(s.email),
      phoneNumber: str(s.phoneNumber),
      address: str(s.address),
      returnPolicy: str(s.returnPolicy),
      shippingPolicy: str(s.shippingPolicy),
      termsOfService: str(s.termsOfService),
    });
  }, [store, reset]);

  const onSubmit = async (data: any) => {
    // Evitar mensajes antiguos tras el envío
    clearErrors();

    try {
      const formData = new FormData();
      if (typeof data.isActive !== "undefined") {
        formData.append("isActive", String(!!data.isActive));
      }
      formData.append("name", data.name ?? "");
      formData.append("description", data.description ?? "");
      formData.append("url", data.url ?? "");

      // Logo: si es File lo enviamos; si es URL válida, la convertimos a File; si es string no-URL, omitimos
      if (data.logoStyle instanceof File) {
        formData.append("logoStyle", data.logoStyle);
      } else if (
        typeof data.logoStyle === "string" &&
        isValidUrl(data.logoStyle)
      ) {
        try {
          const fileFromUrl = await urlToFile(data.logoStyle);
          formData.append("logoStyle", fileFromUrl);
        } catch (e) {
          console.warn("No se pudo convertir logoStyle URL a File:", e);
        }
      }

      formData.append("email", data.email ?? "");
      formData.append("phoneNumber", data.phoneNumber ?? "");
      formData.append("address", data.address ?? "");
      formData.append("returnPolicy", data.returnPolicy ?? "");
      formData.append("shippingPolicy", data.shippingPolicy ?? "");
      formData.append("termsOfService", data.termsOfService ?? "");

      const res = await updateStore(store.id, formData);
      if (!res.error) {
        toast.success("Tienda actualizada correctamente");
      } else {
        toast.error(res.message || "No se pudo actualizar la tienda");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al guardar";
      toast.error(msg);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* Estado de la tienda */}
      <div className="bg-white border rounded-md p-4 flex items-center justify-between">
        <span className="font-medium">Estado de la Tienda</span>
        <div className="flex items-center gap-2">
          <RHFSwitch name="isActive" label="Tienda activa y visible para clientes" />
        </div>
      </div>

      {/* Información básica y contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Información Básica */}
        <div className="bg-white border rounded-md p-4 space-y-4">
          <div className="font-semibold mb-2">Información Básica</div>
          <RHFInputWithLabel name="name" label="Nombre de la Tienda" />
          <RHFInputWithLabel
            name="description"
            label="Descripción"
            type="textarea"
            rows={2}
          />
          <RHFInputWithLabel
            name="url"
            label="URL Amigable"
            prefix="/tienda/"
          />
          <div>
            <div className="mb-1 text-sm font-medium">Logo de la Tienda</div>
            <RHFFileUpload
              name="logoStyle"
              label="Cambiar Logo"
              placeholder="Seleccionar logo"
            />
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="bg-white border rounded-md p-4 space-y-4">
          <div className="font-semibold mb-2">Información de Contacto</div>
          <RHFInputWithLabel
            name="email"
            label="Email de Contacto"
            type="email"
          />
          <RHFInputWithLabel name="phoneNumber" label="Teléfono de Contacto" />
          <RHFInputWithLabel
            name="address"
            label="Dirección"
            type="textarea"
            rows={2}
          />
        </div>
      </div>

      {/* Políticas de la tienda */}
      <div className="bg-white border rounded-md p-4 space-y-4">
        <div className="font-semibold mb-2">Políticas de la Tienda</div>
        <RHFInputWithLabel
          name="returnPolicy"
          label="Política de Devoluciones"
          type="textarea"
          rows={2}
        />
        <RHFInputWithLabel
          name="shippingPolicy"
          label="Política de Envíos"
          type="textarea"
          rows={2}
        />
        <RHFInputWithLabel
          name="termsOfService"
          label="Términos de Servicio"
          type="textarea"
          rows={2}
        />
      </div>

      {/* Botón Guardar Cambios */}
      <div className="flex justify-end">
        <LoaderButton type="submit" disabled={formState.isSubmitting}>
          Guardar Cambios
        </LoaderButton>
      </div>
    </form>
  );
}
