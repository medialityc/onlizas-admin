"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Store } from "@/types/stores";

import StoreTabs from "./components/store-edit-tabs";
import { FormProvider } from "@/components/react-hook-form";
import { updateAdminStore, updateBannersStore } from "@/services/stores";
import { buildStoreFormData } from "./utils/transform";
import storeEditSchema, {
  StoreEditFormData,
} from "../modals/store-edit-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildBannersFormDataFromRHF } from "./utils/banners-form-data";

interface Props {
  store: Store;
}

export default function StoreEditAdminContainer({ store }: Props) {
  const methods = useForm<StoreEditFormData>({
    resolver: zodResolver(storeEditSchema),
    mode: "onBlur",
    shouldUnregister: false,
    defaultValues: {
      id: store.id,
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
  console.log("Errores actuales:", JSON.stringify(methods.formState.errors, null, 2));


  const onSubmit = async (data: any) => {
    // Debug visible error panel if there are errors
    if (Object.keys(methods.formState.errors || {}).length > 0) {
      console.warn(
        "RHF Errors:",
        JSON.stringify(methods.formState.errors, null, 2)
      );
    }
    const result = await methods.trigger();
    console.log("Errores:", methods.formState.errors);


    // Limpia errores previos
    methods.clearErrors();

    try {
      const formData = buildStoreFormData({ store, data });
      // Build banners FormData only if there's at least one banner
      const hasBanners = Array.isArray(data?.banners) && data.banners.length > 0;
      let res = await updateAdminStore(store.id, formData);
      // Send banners array to update endpoint (backend decides create vs update per item)
      if (hasBanners) {
        const bannersFD = buildBannersFormDataFromRHF({ data });
        res = await updateBannersStore(bannersFD);
      }

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
    <FormProvider
      id="store-edit-form"
      methods={methods}
      onSubmit={onSubmit}
    >
      <div className="p-6">
        <StoreTabs store={store} />
      </div>
    </FormProvider>
  );
}
