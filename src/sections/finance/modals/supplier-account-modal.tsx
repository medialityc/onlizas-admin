"use client";

import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import LoaderButton from "@/components/loaders/loader-button";
import Cards, { Focused } from "react-credit-cards-2";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  SupplierAccountSchema,
  SupplierAccountInput,
} from "../schemas/supplier-account";
import {
  createSupplierAccount,
  updateSupplierAccount,
} from "@/services/finance/supplier-accounts";
import { SupplierAccount } from "@/types/finance";
import { toast } from "react-toastify";

const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
};

interface Props {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  onSuccess?: () => void;
  account?: SupplierAccount | null;
  supplierId: string;
}

export default function SupplierAccountModal({
  open,
  onClose,
  loading = false,
  onSuccess,
  account,
  supplierId,
}: Props) {
  const methods = useForm<SupplierAccountInput>({
    resolver: zodResolver(SupplierAccountSchema),
    defaultValues: {
      name: account?.name || "",
      accountNumber: account?.accountNumber || "",
      bank: account?.bank || "",
      isPrimaryAccount: account?.isPrimaryAccount || false,
    },
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  const cardNumber = methods.watch("accountNumber");
  const cardName = methods.watch("name");
  const [focused, setFocused] = useState<Focused>("");

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = async (data: SupplierAccountInput) => {
    try {
      if (account) {
        const res = await updateSupplierAccount(account.id, data);
        if (!res.error) {
          toast.success("Cuenta actualizada correctamente");
        } else if (res.message) {
          toast.error(res.message);
          return;
        }
      } else {
        const res = await createSupplierAccount(supplierId, data);
        if (!res.error) {
          toast.success("Cuenta creada correctamente");
        } else if (res.message) {
          toast.error(res.message);
          return;
        }
      }
      onSuccess?.();
      reset();
      onClose();
    } catch {
      toast.error("Error guardando la cuenta");
    }
  };

  useEffect(() => {
    if (account && open) {
      reset({
        name: account.name,
        accountNumber: formatCardNumber(account.accountNumber),
        bank: account.bank,
        isPrimaryAccount: account.isPrimaryAccount,
      });
    }
    if (!open && !account) {
      reset({
        name: "",
        accountNumber: "",
        bank: "",
        isPrimaryAccount: false,
      });
    }
  }, [account, open, reset]);

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading}
      title={account ? "Editar Cuenta Bancaria" : "Agregar Cuenta Bancaria"}
    >
      <div className="p-5">
        <FormProvider methods={methods} onSubmit={submit}>
          <div className="space-y-4 w-full">
            <RHFInputWithLabel
              name="name"
              label="Nombre de la cuenta"
              placeholder="Ej: Cuenta Principal"
              autoFocus
              maxLength={100}
            />
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3 dark:border-gray-700 dark:bg-[#232830]">
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
                    <div className="flex flex-col gap-2">
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
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
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
                        <span className="text-sm text-red-600 dark:text-red-400">
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
            <label
              htmlFor="isPrimaryAccount"
              className="!mb-0 flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                id="isPrimaryAccount"
                {...methods.register("isPrimaryAccount")}
                className="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-[#1a1c23]"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Marcar como cuenta principal para pagos
              </span>
            </label>
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
              className="btn btn-primary"
            >
              {account ? "Guardar Cambios" : "Agregar Cuenta"}
            </LoaderButton>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
