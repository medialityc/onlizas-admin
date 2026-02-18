"use client";

import SimpleModal from "@/components/modal/modal";
import { Supplier } from "@/types/suppliers";
import { useForm } from "react-hook-form";
import { FormProvider, RHFInputWithLabel } from "@/components/react-hook-form";
import { Button } from "@/components/button/button";
import { useState } from "react";
import showToast from "@/config/toast/toastConfig";
import { updateApprovalProcessFixedTax } from "@/services/supplier";

interface SupplierRateModalProps {
  open: boolean;
  onClose: () => void;
  supplier: Supplier;
}

interface RateFormData {
  commissionRate: number | null;
}

export default function SupplierRateModal({
  open,
  onClose,
  supplier,
}: SupplierRateModalProps) {
  const [loading, setLoading] = useState(false);

  const methods = useForm<RateFormData>({
    defaultValues: {
      commissionRate: supplier.fixedTax || null,
    },
  });

  const handleSubmit = async (data: RateFormData) => {
    const value = data.commissionRate;
    if (value == null || isNaN(value)) {
      showToast("Debe indicar una tasa válida", "error");
      return;
    }

    if (value < 0 || value > 100) {
      showToast("La tasa debe estar entre 0% y 100%", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await updateApprovalProcessFixedTax(supplier.id, value);

      if (res.error) {
        showToast(res.message || "Error al actualizar la tarifa fija", "error");
        return;
      }

      showToast("Tarifa fija actualizada correctamente", "success");
      onClose();
    } catch (error) {
      console.error("Error updating fixed tax", error);
      showToast("Error al actualizar la tarifa fija", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title="Modificar tarifa fija"
      subtitle={`Proveedor: ${supplier.name}`}
    >
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="space-y-2">
          <RHFInputWithLabel
            name="commissionRate"
            label="Tasa de comisión (%)"
            type="number"
            placeholder="Ejemplo: 15 para 15%"
            required
          />
          <p className="text-xs text-gray-500">
            Indica el porcentaje que se descontará al usuario sobre el valor de
            la venta de sus productos. Por ejemplo, 15 significa un 15%.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="primary"
            onClick={onClose}
            className="px-4 py-2"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="px-6 py-2"
          >
            Guardar cambios
          </Button>
        </div>
      </FormProvider>
    </SimpleModal>
  );
}
