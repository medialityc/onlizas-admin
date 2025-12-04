"use client";

import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import LoaderButton from "@/components/loaders/loader-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
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
        accountNumber: account.accountNumber,
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
            <label htmlFor="isPrimaryAccount" className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                id="isPrimaryAccount"
                {...methods.register("isPrimaryAccount")}
                className="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
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
