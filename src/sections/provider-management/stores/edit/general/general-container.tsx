"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import GeneralStatusCard from "./components/general-status-card";
import BasicInfoCard from "./components/basic-info-card";
import ContactInfoCard from "./components/contact-info-card";
import PoliciesCard from "./components/policies-card";
import LoaderButton from "@/components/loaders/loader-button";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { FormProvider } from "@/components/react-hook-form";
import { Store } from "@/types/stores";
import { GeneralStoreSchema, type GeneralStoreForm } from "./general-schema";
import { updateSupplierStore } from "@/services/stores";
import { buildStoreFormData } from "../utils/transform";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface Props {
  store: Store;
}

export default function GeneralContainer({ store }: Props) {
  const methods = useForm<GeneralStoreForm>({
    resolver: zodResolver(GeneralStoreSchema),
    mode: "onBlur",
    defaultValues: {
      active: store.active ?? true,
      name: store.name ?? "",
      description: store.description ?? "",
      url: store.url ?? "",
      logoStyle: store.logoStyle ?? "",
      email: store.email ?? "",
      phoneNumber: store.phoneNumber ?? "",
      address: store.address ?? "",
      returnPolicy: store.returnPolicy ?? "",
      shippingPolicy: store.shippingPolicy ?? "",
      termsOfService: store.termsOfService ?? "",
    },
  });

  const onSubmit = async (data: GeneralStoreForm) => {
    try {
      const formData = buildStoreFormData({
        store,
        data,
      });
      const plainObject = Object.fromEntries(formData.entries());
      console.log("FormData como objeto:", plainObject);

      const res = await updateSupplierStore(store.id, formData);
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
  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);

  return (
    <FormProvider id="general-form" methods={methods} onSubmit={onSubmit}>
      <div className="space-y-6 bg-white dark:bg-gray-900 p-6">
        <GeneralStatusCard />

        {/* Información básica y contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Información Básica */}
          <BasicInfoCard />

          {/* Información de Contacto */}
          <ContactInfoCard />
        </div>

        {/* Políticas de la tienda */}
        <PoliciesCard />

        {/* Botón de guardar */}
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 -mx-6 px-6 py-4 mt-8">
          {hasUpdatePermission && (
            <LoaderButton
              form="general-form"
              type="submit"
              loading={methods.formState.isSubmitting}
              className="btn btn-primary btn-md shadow-sm"
              disabled={!methods.formState.isDirty}
            >
              <span className="inline-flex items-center gap-2">
                <ClipboardDocumentCheckIcon className="w-4 h-4" />
                <span>Guardar Información General</span>
              </span>
            </LoaderButton>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
