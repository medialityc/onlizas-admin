"use client";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import LoaderButton from "@/components/loaders/loader-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  PlatformAccountCreateSchema,
  PlatformAccountCreateInput,
} from "../schemas/platform-account";
import {
  createPlatformAccount,
  updatePlatformAccount,
} from "@/services/finance/platform-accounts";
import { PlatformAccount } from "@/types/finance";
import { toast } from "react-toastify";
import Cards, { Focused } from "react-credit-cards-2";

const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
};

interface Props {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  onSuccess?: () => void;
  account?: PlatformAccount; // if provided => edit mode
}

export default function PlatformAccountCreateModal({
  open,
  onClose,
  loading = false,
  onSuccess,
  account,
}: Props) {
  const methods = useForm<PlatformAccountCreateInput>({
    resolver: zodResolver(PlatformAccountCreateSchema),
    defaultValues: {
      name: account?.name || "",
      accountNumber: account?.accountNumber || "",
      purpose: account ? (String(account.purpose) as any) : "1",
      bank: account?.bank || "",
      isMainAccount: account?.isMainAccount ?? false,
      description: account?.description || "",
    },
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = async (data: PlatformAccountCreateInput) => {
    try {
      if (account) {
        const res = await updatePlatformAccount(account.id, data);
        if (!res.error) {
          toast.success("Cuenta actualizada correctamente");
        } else if (res.message) {
          toast.error(res.message);
          return;
        }
      } else {
        const res = await createPlatformAccount(data);
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

  // Sync form values when switching to edit mode with a loaded account
  useEffect(() => {
    if (account && open) {
      reset({
        name: account.name,
        accountNumber: formatCardNumber(account.accountNumber),
        purpose: String(account.purpose) as any,
        bank: account.bank,
        isMainAccount: account.isMainAccount,
        description: account.description || "",
      });
    }
    // If modal closed and no account, ensure clean creation state
    if (!open && !account) {
      reset({
        name: "",
        accountNumber: "",
        purpose: "1",
        bank: "",
        isMainAccount: false,
        description: "",
      });
    }
  }, [account, open, reset]);
  const cardNumber = methods.watch("accountNumber");
  const cardName = methods.watch("name");
  const [focused, setFocused] = useState<Focused>("");
  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading}
      title={
        account ? "Editar Cuenta de Plataforma" : "Crear Cuenta de Plataforma"
      }
    >
      <div className="p-5">
        <FormProvider methods={methods} onSubmit={submit}>
          <div className="space-y-4 w-full">
            <RHFInputWithLabel
              name="name"
              label="Nombre"
              placeholder="Ej: Cuenta Madre"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <RHFSelectWithLabel
                name="purpose"
                label="Propósito"
                placeholder="Seleccionar..."
                options={[
                  { value: "1", label: "Cuenta madre" },
                  { value: "2", label: "Retención plataforma" },
                  { value: "3", label: "Logística" },
                  { value: "4", label: "Impuestos (7%)" },
                ]}
                emptyOption="Seleccionar..."
                variant="native"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isMainAccount"
                {...methods.register("isMainAccount")}
                className="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-[#1a1c23]"
              />
              <label htmlFor="isMainAccount" className="!mb-0 text-sm text-gray-700 dark:text-gray-300">
                Marcar como principal
              </label>
            </div>
            <RHFInputWithLabel
              name="description"
              type="textarea"
              label="Descripción"
              placeholder="Opcional"
              maxLength={200}
              rows={3}
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
              className="btn btn-primary"
            >
              {account ? "Guardar Cambios" : "Crear Cuenta"}
            </LoaderButton>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
