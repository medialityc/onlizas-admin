"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Store } from "@/types/stores";

import StoreTabs from "./components/store-edit-tabs";
import { FormProvider } from "@/components/react-hook-form";
import { updateSupplierStore } from "@/services/stores";
import { buildStoreFormData } from "./utils/transform";
import { zodResolver } from "@hookform/resolvers/zod";
import storeEditSchema, { StoreEditFormData } from "../modals/store-edit-form.schema";

interface Props {
  store: Store;
}

export default function StoreEditContainer({ store }: Props) {

  const methods = useForm<StoreEditFormData>({
    resolver: zodResolver(storeEditSchema),
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
    }});

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
      const formData = buildStoreFormData({
        store,
        data,
      });
      const plainObject = Object.fromEntries(formData.entries());
      console.log("FormData como objeto:", plainObject);


      const res = await updateSupplierStore(store.id, formData);
      if (!res.error) {
        toast.success("Tienda actualizada correctamente");
        /* // Volver a la pantalla anterior tras guardar cambios
        router.back(); */
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
