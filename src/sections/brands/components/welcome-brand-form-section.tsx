"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import LoaderButton from "@/components/loaders/loader-button";

import { createBrand } from "@/services/brands";
import { brandSchema, BrandFormData } from "@/sections/brands/schemas/brand-schema";

interface WelcomeBrandFormSectionProps {
  afterCreateRedirectTo: string;
}

export function WelcomeBrandFormSection({
  afterCreateRedirectTo,
}: WelcomeBrandFormSectionProps) {
  const router = useRouter();

  const methods = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = methods;

  const submit = async (data: BrandFormData) => {
    try {
      const res = await createBrand({ name: data.name });
      if (!res.error) {
        toast.success("Marca creada correctamente");
        router.push(afterCreateRedirectTo);
      } else if (res.message) {
        toast.error(res.message);
      }
    } catch {
      toast.error("Error guardando la marca");
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={submit}>
      <div className="space-y-4 w-full">
        <RHFInputWithLabel
          name="name"
          label="Nombre de la marca"
          placeholder="Ej: Acme"
          autoFocus
          maxLength={100}
        />
        <p className="text-xs text-muted-foreground">
          Crea una marca inicial para clasificar tus productos durante la
          configuración.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <LoaderButton
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Guardar marca y continuar
        </LoaderButton>
      </div>
    </FormProvider>
  );
}
