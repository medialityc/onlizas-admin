"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";

import { Store } from "@/types/stores";

import StoreTabs from "./components/store-edit-tabs";
import { GeneralStoreSchema } from "./general/general-schema";
import { updateStore } from "@/services/stores";
import { FormProvider } from "@/components/react-hook-form";

interface Props {
  store: Store;
}

export default function StoreEditContainer({ store }: Props) {
  const methods = useForm({
    resolver: zodResolver(GeneralStoreSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: any) => {
    // Limpia errores previos
    methods.clearErrors();

    try {
      const formData = new FormData();
      if (typeof data.isActive !== "undefined") {
        formData.append("isActive", String(!!data.isActive));
      }
      formData.append("name", data.name ?? "");
      formData.append("description", data.description ?? "");
      formData.append("url", data.url ?? "");

      // Logo: solo si es un File nuevo
      if (data.logoStyle instanceof File) {
        formData.append("logoStyle", data.logoStyle);
      }

      formData.append("email", data.email ?? "");
      formData.append("phoneNumber", data.phoneNumber ?? "");
      formData.append("address", data.address ?? "");
      formData.append("returnPolicy", data.returnPolicy ?? "");
      formData.append("shippingPolicy", data.shippingPolicy ?? "");
      formData.append("termsOfService", data.termsOfService ?? "");

      // Payloads de otros tabs
      if (Array.isArray(data.categoriesPayload)) {
        formData.append("categories", JSON.stringify(data.categoriesPayload));
      }

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
    <FormProvider id="store-edit-form" methods={methods} onSubmit={onSubmit}>
      <div className="p-6">
        <StoreTabs store={store} />
      </div>
    </FormProvider>
  );
}
