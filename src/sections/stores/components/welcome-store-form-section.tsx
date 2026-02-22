"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { AlertBox } from "@/components/alert/alert-box";
import FormProvider from "@/components/react-hook-form/form-provider";
import {
  StoreFormData,
  storeSchema,
} from "@/sections/stores/modals/stores-schema";
import { createStore } from "@/services/stores";
import { isValidUrl, urlToFile } from "@/utils/format";
import StoreCreateForm from "@/sections/stores/modals/store-create-form";

interface WelcomeStoreFormSectionProps {
  afterCreateRedirectTo: string;
}

export function WelcomeStoreFormSection({
  afterCreateRedirectTo,
}: WelcomeStoreFormSectionProps) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const methods = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      url: "",
      email: "",
      phoneNumber: "",
      countryCode: "",
      address: "",
      logoStyle: undefined,
      ownerId: undefined,
      businessId: undefined,
    },
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    reset();
    setError(null);
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
          formData.append("logoStyle", data.logoStyle);
        }
      }

      if (data.ownerId) {
        formData.append("ownerId", data.ownerId.toString());
      }
      if (data.businessId) {
        formData.append("businessId", data.businessId.toString());
      }

      formData.append("url", data.url);
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("countryCode", data.countryCode);
      formData.append("address", data.address);

      const response = await createStore(formData);

      if (response && response.status === 200) {
        toast.success("Tienda creada exitosamente");
        router.push(afterCreateRedirectTo);
      } else if (response.status === 409) {
        toast.error("Ya existe un negocio con ese código");
      } else {
        toast.error(response.message || "No se pudo procesar esta Tienda");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar la tienda";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
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
  );
}
