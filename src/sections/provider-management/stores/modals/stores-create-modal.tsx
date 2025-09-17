"use client";

import { AlertBox } from "@/components/alert/alert-box";
import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { StoreFormData, storeSchema } from "./stores-schema";
import { CreateStore } from "@/types/stores";
import { createStore } from "@/services/stores";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { useRouter } from "next/navigation";
import { getAllUserBusiness } from "@/services/business";
import { useAuth } from "@/auth-sso/hooks/use-auth";
import { processImageFile } from "@/utils/image-helpers";

interface StoresModalProps {
  open: boolean;
  onClose: () => void;
  store?: CreateStore; // Opcional si se usa para editar
  loading: boolean;
  onSuccess?: () => void; // Opcional si se usa para editar
}

export default function StoresCreateModal({
  open,
  onClose,
  store,
  loading,
  onSuccess,
}: StoresModalProps) {
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const routerHook = useRouter();

  const methods = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: store?.name ?? "",
      url: store?.url ?? "",
      email: store?.email ?? "",
      phoneNumber: store?.phoneNumber ?? "",
      address: store?.address ?? "",
      logoStyle: store?.logoStyle ?? undefined,
      returnPolicy: store?.returnPolicy ?? "",
      shippingPolicy: store?.shippingPolicy ?? "",
      termsOfService: store?.termsOfService ?? "",
      ownerId: user?.id ?? 0,
      businessId: store?.businessId ?? undefined,
    },
  });

  const {
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const ownerId = watch("ownerId");
  const businessId = watch("businessId");

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: StoreFormData) => {
    setError(null);
    if (!data.ownerId) {
      toast.error("Propietario no disponible");
      return;
    }
    if (!data.businessId) {
      toast.error("Debe seleccionar un negocio");
      return;
    }
    try {
      const formData = new FormData();

      //procesar imagen
      if (data.logoStyle) {
        const processedImage = await processImageFile(data.logoStyle);
        if (processedImage) {
          formData.append("logoStyle", processedImage);
        } else {
          toast.error("Error al procesar la imagen desde URL");
        }
      }

      formData.append("ownerId", String(data.ownerId));
      formData.append("businessId", String(data.businessId));
      console.log(formData.get("businessId"), "Esta es la data");
      // url es obligatorio según el schema
      formData.append("url", data.url);
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("address", data.address);
      formData.append("returnPolicy", data.returnPolicy);
      formData.append("shippingPolicy", data.shippingPolicy);
      formData.append("termsOfService", data.termsOfService);

      console.log(formData);
      let response = null;
      response = await createStore(formData);

      console.log(response);

      if (response && (response.status === 200 || response.status === 201)) {
        //queryClient.invalidateQueries({ queryKey: ["stores"] });
        const createdId =
          (response.data as any)?.id ?? (response.data as any)?.storeId;
        toast.success("Tienda creada exitosamente");
        onSuccess?.();
        console.log(createdId);
        if (createdId) {
          routerHook.push(`/provider/stores/${createdId}`);
          return;
        }
        reset();
        handleClose();
      } else {
        if (response?.status === 409) {
          toast.error("Ya existe un negocio con ese código");
        } else {
          toast.error(response?.message || "No se pudo procesar esta Tienda");
        }
      }
    } catch (err) {
      console.log(err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar la tienda";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading}
      title={"Crear Nueva Tienda"}
    >
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <AlertBox title="Error" variant="danger" message={error} />
          </div>
        )}

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="space-y-4">
            {/* Primera fila: Nombre y Negocio (fetcher) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RHFInputWithLabel
                name="name"
                label="Nombre de Tienda"
                placeholder="Ingrese el nombre de su tienda"
                //autoFocus
                maxLength={100}
                required
                size="medium"
                containerClassname="[&>div>div>label]:text-base"
              />
              {/* URL Input */}
              <RHFInputWithLabel
                name="url"
                label="URL de la Tienda"
                placeholder="https://mi-tienda.com"
                type="text"
                required
                size="medium"
                containerClassname="[&>div>div>label]:text-base"
              />
            </div>
            <RHFAutocompleteFetcherInfinity
              name="businessId"
              label="Negocio"
              placeholder="Buscar negocio..."
              required
              onFetch={(params) => getAllUserBusiness(user?.id ?? 0, params)}
              objectKeyLabel="name"
              size="medium"
              params={{ pageSize: 10 }}
              containerClassname="[&>div>div>label]:text-base"
            />

            {/* Logo Upload */}
            <RHFImageUpload
              name="logoStyle"
              label="Logo de la tienda"
              variant="rounded"
              size="full"
              className="[&>label]:text-base"
            />
            {/* Email Input */}
            <RHFInputWithLabel
              name="email"
              label="Email"
              placeholder="contacto@store.com"
              type="email"
              required
              size="medium"
              containerClassname="[&>div>div>label]:text-base"
            />

            {/* Phone Input */}
            <RHFInputWithLabel
              name="phoneNumber"
              label="Teléfono"
              placeholder="+1234567890"
              maxLength={20}
              required
              size="medium"
              type="tel"
              containerClassname="[&>div>div>label]:text-base"
            />

            {/* Address Input */}
            <RHFInputWithLabel
              name="address"
              label="Dirección"
              placeholder="Calle Principal 123, Ciudad, País"
              maxLength={200}
              rows={3}
              type="textarea"
              required
              containerClassname="[&>label]:text-base [&>textarea]:text-sm"
            />
            {/* Return Policy Input */}
            <RHFInputWithLabel
              name="returnPolicy"
              label="Política de Reembolso"
              placeholder=" Escriba la política que seguirá su tienda"
              maxLength={200}
              rows={3}
              type="textarea"
              required
              size="medium"
              containerClassname="[&>label]:text-base [&>textarea]:text-sm"
            />
            {/* Shipping Policy Input */}
            <RHFInputWithLabel
              name="shippingPolicy"
              label="Política de Envío"
              placeholder=" Escriba la política que seguirá su tienda"
              maxLength={200}
              rows={3}
              type="textarea"
              required
              size="medium"
              containerClassname="[&>label]:text-base [&>textarea]:text-sm"
            />
            {/* Terms of Service Input */}
            <RHFInputWithLabel
              name="termsOfService"
              label="Términos del Servicio"
              placeholder=" Escriba la términos que seguirá su tienda"
              maxLength={200}
              rows={3}
              type="textarea"
              required
              size="medium"
              containerClassname="[&>label]:text-base [&>textarea]:text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-outline-secondary"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <LoaderButton
              type="submit"
              loading={isSubmitting}
              className="btn btn-primary text-textColor"
              disabled={isSubmitting || !ownerId || !businessId}
            >
              Crear Tienda
            </LoaderButton>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
