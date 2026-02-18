"use client";

import { FormProvider } from "@/components/react-hook-form";
import { Button } from "@/components/button/button";
import AddressSection from "./components/address-section";
import { useMeWarehouseCreateForm } from "../../hooks/use-me-warehouse-create-form";
import { useCallback } from "react";
import RHFInput from "@/components/react-hook-form/rhf-input";
import { MeWarehouseFormData } from "../../schemas/me-warehouse-schema";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "../../../../lib/permissions";

type Props = {
  warehouse?: MeWarehouseFormData;
  onClose?: () => void;
};
export function MeWarehouseForm({ warehouse, onClose }: Props) {
  const { form, isPending, onSubmit } = useMeWarehouseCreateForm(
    warehouse,
    onClose,
  );

  const handleClose = useCallback(() => {
    onClose?.();
    form.reset();
  }, [form, onClose]);

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasCreatePermission = hasPermission([PERMISSION_ENUM.SUPPLIER_CREATE]);

  return (
    <FormProvider
      methods={form}
      onSubmit={onSubmit}
      id="me-warehouse-form"
      noValidate
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="col-span-1 space-y-4">
          <div className="col-span-1 xl:col-span-2">
            <RHFInput
              name="name"
              label="Nombre del Almacén"
              placeholder="Ej: Centro de Distribución Principal"
              required
            />
          </div>

          <AddressSection showCountryAndDistrict={!warehouse?.id} />
        </div>
      </div>
      {/* Actions stickies */}
      <div className="sticky bottom-0 mt-6 -mx-6 px-6 py-4 bg-white/80 dark:bg-gray-900/60 backdrop-blur border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3">
        <Button onClick={handleClose} type="button" variant="secondary">
          Cancelar
        </Button>

        {hasCreatePermission && (
          <Button
            form="me-warehouse-form"
            type="submit"
            variant="primary"
            disabled={isPending}
          >
            {isPending ? "Guardando..." : "Guardar Cambios"}
          </Button>
        )}
      </div>
    </FormProvider>
  );
}
