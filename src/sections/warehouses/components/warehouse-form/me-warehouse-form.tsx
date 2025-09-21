"use client";

import { FormProvider, RHFInputWithLabel } from "@/components/react-hook-form";
import { Button } from "@/components/button/button";
import LocationSection from "./components/location-section";
import { useMeWarehouseCreateForm } from "../../hooks/use-me-warehouse-create-form";
import { useCallback } from "react";
import RHFInput from "@/components/react-hook-form/rhf-input";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllWarehousesVirtualType } from "@/services/warehouses-virtual-types";
import { MeWarehouseFormData } from "../../schemas/me-warehouse-schema";
import { usePermissions } from "@/auth-sso/permissions-control/hooks";

type Props = {
  warehouse?: MeWarehouseFormData;
  onClose?: () => void;
};
export function MeWarehouseForm({ warehouse, onClose }: Props) {
  const { form, isPending, onSubmit } = useMeWarehouseCreateForm(
    warehouse,
    onClose
  );

  const handleClose = useCallback(() => {
    onClose?.();
    form.reset();
  }, [form, onClose]);

  // Control de permisos
  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every(perm => permissions.some(p => p.code === perm));
  };
  const hasUpdatePermission = hasPermission(["UPDATE_ALL"]);

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
          <div>
            <RHFAutocompleteFetcherInfinity
              name="virtualTypeId"
              label="Tipo de almacén virtual"
              placeholder="Seleccionar un tipo de almacén"
              onFetch={(params) =>
                getAllWarehousesVirtualType({ ...params, isActive: true })
              }
              objectValueKey="id"
              objectKeyLabel="name"
              queryKey="warehouse-virtual-types"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <RHFInputWithLabel
              name="rules"
              label="Reglas"
              placeholder="Regla"
            />
          </div>

          <LocationSection />
        </div>
      </div>
      {/* Actions stickies */}
      <div className="sticky bottom-0 mt-6 -mx-6 px-6 py-4 bg-white/80 dark:bg-gray-900/60 backdrop-blur border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3">
        <Button onClick={handleClose} type="button" variant="secondary" outline>
          Cancelar
        </Button>

        {hasUpdatePermission && (
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
