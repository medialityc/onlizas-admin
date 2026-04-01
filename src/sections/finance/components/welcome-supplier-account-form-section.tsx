"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cards, { Focused } from "react-credit-cards-2";

import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import LoaderButton from "@/components/loaders/loader-button";

import {
  SupplierAccountSchema,
  SupplierAccountInput,
} from "@/sections/finance/schemas/supplier-account";
import { createSupplierAccount } from "@/services/finance/supplier-accounts";

const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
};

interface WelcomeSupplierAccountFormSectionProps {
  supplierId: string;
  afterCreateRedirectTo: string;
}

export function WelcomeSupplierAccountFormSection({
  supplierId,
  afterCreateRedirectTo,
}: WelcomeSupplierAccountFormSectionProps) {
  const router = useRouter();
  const [focused, setFocused] = useState<Focused>("");

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

  const cardNumber = methods.watch("accountNumber");
  const cardName = methods.watch("name");

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

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
          <div className="flex justify-center">
            <Cards
              number={cardNumber || ""}
              name={cardName || "TITULAR"}
              expiry=""
              cvc=""
              focused={focused}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Controller
              name="accountNumber"
              control={methods.control}
              render={({ field, fieldState: { error } }) => (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Número de tarjeta
                  </label>
                  <div className="relative">
                    <input
                      {...field}
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(formatCardNumber(e.target.value))
                      }
                      onFocus={() => setFocused("number")}
                      onBlur={() => setFocused("")}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      inputMode="numeric"
                      className={`form-input w-full pl-10 font-mono tracking-widest${
                        error ? " border-red-500 focus:border-red-500" : ""
                      }`}
                    />
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <rect
                          x={1}
                          y={4}
                          width={22}
                          height={16}
                          rx={2}
                          ry={2}
                        />
                        <line x1={1} y1={10} x2={23} y2={10} />
                      </svg>
                    </span>
                  </div>
                  {error && (
                    <span className="text-sm text-red-600">
                      {error.message}
                    </span>
                  )}
                </div>
              )}
            />
            <RHFInputWithLabel
              name="bank"
              label="Banco"
              placeholder="Ej: Banco XYZ"
              maxLength={60}
            />
          </div>
        </div>

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
          Guardar cuenta y continuar
        </LoaderButton>
      </div>
    </FormProvider>
  );
}
