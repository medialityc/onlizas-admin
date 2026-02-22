"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import LoaderButton from "@/components/loaders/loader-button";

import {
  SupplierAccountSchema,
  SupplierAccountInput,
} from "@/sections/finance/schemas/supplier-account";
import { createSupplierAccount } from "@/services/finance/supplier-accounts";

interface WelcomeSupplierAccountFormSectionProps {
  supplierId: string;
  afterCreateRedirectTo: string;
}

export function WelcomeSupplierAccountFormSection({
  supplierId,
  afterCreateRedirectTo,
}: WelcomeSupplierAccountFormSectionProps) {
  const router = useRouter();

  const methods = useForm<SupplierAccountInput>({
    resolver: zodResolver(SupplierAccountSchema),
    defaultValues: {
      name: "",
      accountNumber: "",
      bank: "",
      isPrimaryAccount: true,
    },
  });

  const {
    formState: { isSubmitting },
  } = methods;

  const submit = async (data: SupplierAccountInput) => {
    try {
      const res = await createSupplierAccount(supplierId, data);
      if (!res.error) {
        toast.success("Cuenta creada correctamente");
        router.push(afterCreateRedirectTo);
      } else if (res.message) {
        toast.error(res.message);
      }
    } catch {
      toast.error("Error guardando la cuenta");
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={submit}>
      <div className="space-y-4 w-full">
        <RHFInputWithLabel
          name="name"
          label="Nombre de la cuenta"
          placeholder="Ej: Cuenta Principal"
          autoFocus
          maxLength={100}
        />
        <RHFInputWithLabel
          name="accountNumber"
          label="Número de cuenta"
          placeholder="Ej: 1234567890"
          maxLength={30}
        />
        <RHFInputWithLabel
          name="bank"
          label="Banco"
          placeholder="Ej: Banco XYZ"
          maxLength={60}
        />
        <p className="text-xs text-muted-foreground">
          Esta cuenta se marcará como principal para recibir los pagos.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <LoaderButton
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Guardar cuenta y finalizar
        </LoaderButton>
      </div>
    </FormProvider>
  );
}
