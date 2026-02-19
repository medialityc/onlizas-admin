"use client";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import LoaderButton from "@/components/loaders/loader-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
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
        accountNumber: account.accountNumber,
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              />
              <label htmlFor="isMainAccount" className="text-sm">
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
