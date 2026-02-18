"use client";

import SimpleModal from "@/components/modal/modal";
import { Supplier } from "@/types/suppliers";
import { useForm } from "react-hook-form";
import { FormProvider } from "@/components/react-hook-form";
import RHFDateInput from "@/components/react-hook-form/rhf-date-input";
import { Button } from "@/components/button/button";
import { useState } from "react";
import { updateExpirationDate } from "@/services/supplier";
import showToast from "@/config/toast/toastConfig";

interface SupplierExpirationModalProps {
  open: boolean;
  onClose: () => void;
  supplier: Supplier;
}

interface ExpirationFormData {
  newExpirationDate?: Date;
}

export default function SupplierExpirationModal({
  open,
  onClose,
  supplier,
}: SupplierExpirationModalProps) {
  const [loading, setLoading] = useState(false);

  const methods = useForm<ExpirationFormData>({
    defaultValues: {
      newExpirationDate: supplier.expirationDate
        ? new Date(supplier.expirationDate)
        : undefined,
    },
  });

  const handleSubmit = async (data: ExpirationFormData) => {
    if (!data.newExpirationDate) {
      showToast("Debe seleccionar una nueva fecha de expiración", "error");
      return;
    }

    setLoading(true);
    try {
      const newExpirationDateIso = data.newExpirationDate.toISOString();
      const res = await updateExpirationDate(supplier.id, newExpirationDateIso);

      if (res.error) {
        showToast(
          res.message || "Error al actualizar la fecha de expiración",
          "error",
        );
        return;
      }

      showToast("Fecha de expiración actualizada correctamente", "success");
      onClose();
    } catch (error) {
      console.error("Error updating expiration date", error);
      showToast("Error al actualizar la fecha de expiración", "error");
    } finally {
      setLoading(false);
    }
  };

  const currentExpiration = supplier.expirationDate
    ? new Date(supplier.expirationDate)
    : null;

  const today = new Date();

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title={`Modificar fecha de expiración`}
      subtitle={`Proveedor: ${supplier.name}`}
    >
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {currentExpiration && !isNaN(currentExpiration.getTime()) && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Fecha de expiración actual:</strong>{" "}
              {currentExpiration.toLocaleDateString("es-ES")}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <RHFDateInput
            name="newExpirationDate"
            label="Nueva fecha de expiración"
            required
          />
          <p className="text-xs text-gray-500">
            Selecciona la nueva fecha hasta la cual será válida la autorización
            del proveedor.
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
