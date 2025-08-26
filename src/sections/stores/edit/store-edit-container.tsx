"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Store } from "@/types/stores";

import StoreTabs from "./components/store-edit-tabs";
import { updateAdminStore } from "@/services/stores";
import { FormProvider } from "@/components/react-hook-form";
import { updateAdminStore } from "@/services/stores";

interface Props {
  store: Store;
  supplierId: number;
}

export default function StoreEditContainer({ store, supplierId }: Props) {
  const router = useRouter();
  const methods = useForm<any>({
    mode: "onBlur",
    shouldUnregister: false,
    defaultValues: {
      isActive: store.isActive,
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
      categoriesPayload: [],
      promotionsPayload: [],
      // Campos aplanados (sin appearance.*)
      primaryColor: store.primaryColor ?? "#3B82F6",
      secondaryColor: store.secondaryColor ?? "#111827",
      accentColor: store.accentColor ?? "#F59E0B",
      // Use backend enum values directly
      font: (store.font as any) ?? "ARIAL",
      template: (store.template as any) ?? "MODERNO",
      banners: store.banners ?? [],
    },
  });

  // Pre-registro de campos virtuales para que aparezcan en el submit aun si el tab no fue visitado
  useEffect(() => {
    methods.register("categoriesPayload");
    methods.register("promotionsPayload");
    methods.register("banners");

    methods.register("primaryColor");
    methods.register("secondaryColor");
    methods.register("accentColor");
    methods.register("font");
    methods.register("template");
  }, [methods]);

  const onSubmit = async (data: any) => {
    // Limpia errores previos
    methods.clearErrors();

    try {
      const formData = new FormData();

      // Valores de apariencia (aplanados)
      const primaryColor = data?.primaryColor ?? store.primaryColor ?? "";
      const secondaryColor = data?.secondaryColor ?? store.secondaryColor ?? "";
      const accentColor = data?.accentColor ?? store.accentColor ?? "";
      const font = data?.font ?? store.font ?? "";
      const template = data?.template ?? store.template ?? "";

      // Banners desde el tab Apariencia (aplanado)
      const banners = Array.isArray(data?.banners) ? data.banners : [];

      // Logo: archivo si hay nuevo; si no, enviar el string actual
      const logoValue =
        data.logoStyle instanceof File
          ? null
          : typeof data.logoStyle === "string"
            ? data.logoStyle
            : (store.logoStyle ?? "");
      if (data.logoStyle instanceof File)
        formData.append("logoStyle", data.logoStyle);
      else formData.append("logoStyle", logoValue ?? "");

      // Campos escalares
      formData.append("id", String(store.id));
      formData.append("name", data.name ?? store.name ?? "");
      formData.append(
        "description",
        data.description ?? store.description ?? ""
      );
      formData.append("url", data.url ?? store.url ?? "");
      formData.append("email", data.email ?? store.email ?? "");
      formData.append(
        "phoneNumber",
        data.phoneNumber ?? store.phoneNumber ?? ""
      );
      formData.append("address", data.address ?? store.address ?? "");
      formData.append(
        "returnPolicy",
        data.returnPolicy ?? store.returnPolicy ?? ""
      );
      formData.append(
        "shippingPolicy",
        data.shippingPolicy ?? store.shippingPolicy ?? ""
      );
      formData.append(
        "termsOfService",
        data.termsOfService ?? store.termsOfService ?? ""
      );
      formData.append("primaryColor", primaryColor);
      formData.append("secondaryColor", secondaryColor);
      formData.append("accentColor", accentColor);
      formData.append("font", font);
      formData.append("template", template);
      formData.append("businessName", store.businessName ?? "");
      formData.append("supplierId", String(supplierId));
      formData.append("supplierName", store.supplierName ?? "");

      // Arreglos complejos como JSON strings
      formData.append(
        "followers",
        JSON.stringify(Array.isArray(store.followers) ? store.followers : [])
      );
      formData.append("banners", JSON.stringify(banners ?? []));
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      const res = await updateAdminStore( store.id, formData);
      if (!res.error) {
        toast.success("Tienda actualizada correctamente");
        // Volver a la pantalla anterior tras guardar cambios
        router.back();
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
        <div className="mt-6"></div>
      </div>
    </FormProvider>
  );
}
