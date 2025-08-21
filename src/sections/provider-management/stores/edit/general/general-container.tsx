"use client";

import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Store } from "@/types/stores";
import {
  RHFInputWithLabel,
  RHFSwitch,
  RHFFileUpload,
} from "@/components/react-hook-form";
import LoaderButton from "@/components/loaders/loader-button";
import { toast } from "react-toastify";
import { updateStore } from "@/services/stores";
// No convertir URL existente a File; solo enviar si el usuario sube un nuevo archivo
import {
  InformationCircleIcon,
  PhoneIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface Props {
  store: Store;
}

export default function GeneralContainer({ store }: Props) {
  const { handleSubmit, formState, reset, clearErrors } = useFormContext();

  useEffect(() => {
    const s = store as any;
    const str = (v: unknown) =>
      v === null || v === undefined ? "" : String(v);
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

      // Logo: solo enviar si el usuario seleccionó un nuevo archivo
      // Evita re-subir la URL existente (Swagger no lo hace y el backend puede fallar)
      if (data.logoStyle instanceof File) {
        formData.append("logoStyle", data.logoStyle);
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
      <div className="bg-white border rounded-lg shadow-lg p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-base text-gray-900">Estado de la Tienda</span>
        </div>
        <div className="flex items-center gap-2">
          <RHFSwitch
            name="isActive"
            label="Tienda activa y visible para clientes"
            checkedClassName="peer-checked:bg-gradient-to-r peer-checked:from-secondary peer-checked:to-indigo-600"
          />
        </div>
      </div>

      {/* Información básica y contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Información Básica */}
        <div className="bg-white border rounded-lg shadow-lg p-5 space-y-4">
          <div className="mb-2">
            <div className="flex items-center gap-3 text-gray-900">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-blue-600/20 shadow">
                <InformationCircleIcon className="w-6 h-6 text-blue-700" />
              </span>
              <div className="font-semibold text-base">Información Básica</div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Nombre, descripción, URL y logo que se mostrarán a tus clientes.</p>
          </div>
          <RHFInputWithLabel name="name" label="Nombre de la Tienda" required />
          <RHFInputWithLabel
            name="description"
            label="Descripción"
            type="textarea"
            rows={2}
            required
          />
          <RHFInputWithLabel
            name="url"
            label="URL Amigable"
            prefix="/tienda/"
            required
          />
          <div>
            {/* <div className="mb-1 text-sm font-medium">Logo de la Tienda</div> */}
            <RHFFileUpload
              name="logoStyle"
              label="Cambiar Logo"
              placeholder="Seleccionar logo"
            />
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="bg-white border rounded-lg shadow-lg p-5 space-y-4">
          <div className="mb-2">
            <div className="flex items-center gap-3 text-gray-900">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-emerald-600/20 shadow">
                <PhoneIcon className="w-6 h-6 text-emerald-700" />
              </span>
              <div className="font-semibold text-base">Información de Contacto</div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Datos para consultas y soporte al cliente.</p>
          </div>
          <RHFInputWithLabel
            name="email"
            label="Email de Contacto"
            type="email"
            required
          />
          <RHFInputWithLabel placeholder="+123456789" name="phoneNumber" type="tel" label="Teléfono de Contacto" />
          <RHFInputWithLabel
            name="address"
            label="Dirección"
            type="textarea"
            rows={2}
          />
        </div>
      </div>

      {/* Políticas de la tienda */}
      <div className="bg-white border rounded-lg shadow-lg p-5 space-y-4">
        <div className="mb-2">
          <div className="flex items-center gap-3 text-gray-900">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-amber-600/20 shadow">
              <ClipboardDocumentCheckIcon className="w-6 h-6 text-amber-700" />
            </span>
            <div className="font-semibold text-base">Políticas de la Tienda</div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Define con claridad tus políticas para generar confianza.</p>
        </div>
        <RHFInputWithLabel
          name="returnPolicy"
          label="Política de Devoluciones"
          type="textarea"
          rows={2}
          required
        />
        <div className="border-t border-gray-100 pt-4">
          <RHFInputWithLabel
            name="shippingPolicy"
            label="Política de Envíos"
            type="textarea"
            rows={2}
            required
          />
        </div>
        <div className="border-t border-gray-100 pt-4">
          <RHFInputWithLabel
            name="termsOfService"
            label="Términos de Servicio"
            type="textarea"
            rows={2}
            required
          />
        </div>
      </div>

      {/* Botón Guardar Cambios */}
      <div className="flex justify-end">
        <LoaderButton type="submit" disabled={formState.isSubmitting}>
          <span className="inline-flex items-center gap-2">
            <ClipboardDocumentCheckIcon className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </span>
        </LoaderButton>
      </div>
    </form>
  );
}
