"use client";

import { AlertBox } from "@/components/alert/alert-box";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { StoreFormData, storeSchema } from "./stores-schema";
import { CreateStore } from "@/types/stores";
import { createStore } from "@/services/stores";
import { isValidUrl, urlToFile } from "@/utils/format";
import { useRouter } from "next/navigation";
import StoreCreateForm from "./store-create-form";

interface StoresModalProps {
  open: boolean;
  onClose: () => void;
  store?: CreateStore; // Opcional si se usa para editar
  loading: boolean;
  onSuccess?: () => void; // Opcional si se usa para editar
  afterCreateRedirectTo?: string;
}

export default function StoresCreateModal({
  open,
  onClose,
  store,
  loading,
  onSuccess,
  afterCreateRedirectTo,
}: StoresModalProps) {
  const [error, setError] = useState<string | null>(null);

  const routerHook = useRouter();

  const methods = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: store?.name ?? "",
      url: store?.url ?? "",
      email: store?.email ?? "",
      phoneNumber: store?.phoneNumber ?? "",
      countryCode: store?.countryCode ?? "",
      address: store?.address ?? "",
      logoStyle: store?.logoStyle ?? undefined,
      ownerId: store?.ownerId ?? undefined,
      businessId: store?.businessId ?? undefined,
    },
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: StoreFormData) => {
    setError(null);
    try {
      const formData = new FormData();

      if (data.logoStyle) {
        if (typeof data.logoStyle === "string" && isValidUrl(data.logoStyle)) {
          try {
            const imageFile = await urlToFile(data.logoStyle);
            formData.append("logoStyle", imageFile);
          } catch {
            toast.error("Error al procesar la imagen desde URL");
            return;
          }
        } else if (data.logoStyle instanceof File) {
          // Already a File object
          formData.append("logoStyle", data.logoStyle);
        }
      }

      formData.append("ownerId", data.ownerId.toString());
      formData.append("businessId", data.businessId.toString());
      // url es obligatorio según el schema
      formData.append("url", data.url);
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("countryCode", data.countryCode);
      formData.append("address", data.address);

      let response = null;
      response = await createStore(formData);

      if (response && response.status === 200) {
        //queryClient.invalidateQueries({ queryKey: ["stores"] });
        const createdId =
          (response.data as any)?.id ?? (response.data as any)?.storeId;
        toast.success("Tienda creada exitosamente");
        onSuccess?.();
        if (afterCreateRedirectTo) {
          routerHook.push(afterCreateRedirectTo);
          return;
        }
        if (createdId) {
          routerHook.push(`/dashboard/stores/${createdId}`);
          return;
        }
        reset();
        handleClose();
      } else {
        if (response.status === 409) {
          toast.error("Ya existe un negocio con ese código");
        } else {
          toast.error(response.message || "No se pudo procesar esta Tienda");
        }
      }
    } catch (err) {
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
          <StoreCreateForm
            isSubmitting={isSubmitting}
            handleClose={handleClose}
          />
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
