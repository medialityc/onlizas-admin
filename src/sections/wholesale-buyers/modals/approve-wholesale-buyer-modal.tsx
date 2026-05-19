"use client";

import SimpleModal from "@/components/modal/modal";
import { Button } from "@/components/button/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveWholesaleBuyer } from "@/services/wholesale-buyers";
import showToast from "@/config/toast/toastConfig";
import { WholesaleBuyerDTO } from "@/types/wholesale-buyers";
import { useForm } from "react-hook-form";
import { FormProvider } from "@/components/react-hook-form";
import RHFDateInput from "@/components/react-hook-form/rhf-date-input";

interface Props {
  open: boolean;
  onClose: () => void;
  buyer: WholesaleBuyerDTO;
}

interface FormData {
  expiresAt?: Date;
}

export default function ApproveWholesaleBuyerModal({
  open,
  onClose,
  buyer,
}: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const methods = useForm<FormData>({
    defaultValues: { expiresAt: undefined },
  });

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await approveWholesaleBuyer(buyer.id, {
        expiresAt: data.expiresAt ? data.expiresAt.toISOString() : null,
      });

      if (res.error) {
        showToast(res.message || "Error al aprobar la solicitud", "error");
        return;
      }

      showToast("Solicitud aprobada correctamente", "success");
      router.refresh();
      onClose();
    } catch {
      showToast("Ocurrió un error, intente nuevamente", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title="Aprobar comprador mayorista"
      subtitle={`${buyer.userName} — ${buyer.businessName}`}
      size="sm"
    >
      <div className="p-5 space-y-4">
        <FormProvider
          methods={methods}
          onSubmit={methods.handleSubmit(handleSubmit)}
        >
          <div className="space-y-4">
            <RHFDateInput
              name="expiresAt"
              label="Fecha de expiración (opcional)"
              placeholder="Sin expiración"
            />
            <p className="text-xs text-gray-500">
              Si no selecciona fecha, el acceso no tendrá vencimiento.
            </p>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Aprobar
            </Button>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
