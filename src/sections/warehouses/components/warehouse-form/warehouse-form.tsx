"use client";

import { FormProvider } from "@/components/react-hook-form";
import { Button } from "@/components/button/button";
import BasicInfoSection from "./components/basic-info-section";
import CapacitySection from "./components/capacity-section";
import AddressSection from "./components/address-section";
import { useWarehouseCreateForm } from "../../hooks/use-warehouse-create-form";
import { WarehouseFormData } from "../../schemas/warehouse-schema";
import { getAdapterWarehouse } from "../../adapter/warehouse-edit.adapter";
import VirtualSection from "./components/virtual-section";
import { WAREHOUSE_TYPE_ENUM } from "../../constants/warehouse-type";
import Link from "next/link";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { getWarehouseRoute } from "../../utils/warehouse";

type Props = {
  warehouse?: WarehouseFormData;
};
export function WarehouseForm({ warehouse }: Props) {
  const { form, isPending, onSubmit, warehouseType } = useWarehouseCreateForm(
    warehouse && getAdapterWarehouse(warehouse),
  );
  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasCreatePermission = hasPermission([
    PERMISSION_ENUM.CREATE,
    PERMISSION_ENUM.SUPPLIER_CREATE,
  ]);

  return (
    <FormProvider
      methods={form}
      onSubmit={onSubmit}
      id="warehouse-form"
      noValidate
    >
      <div className="grid grid-cols-1  gap-4">
        <div className="col-span-1  space-y-4">
          <BasicInfoSection warehouseId={warehouse?.id} />
          {warehouseType === WAREHOUSE_TYPE_ENUM.warehouse && (
            <CapacitySection />
          )}
          {warehouseType === WAREHOUSE_TYPE_ENUM.virtualwarehouse && (
            <VirtualSection />
          )}
          <AddressSection showCountryAndDistrict={!warehouse?.id} />
        </div>
      </div>
      {/* Actions stickies */}
      <div className="sticky bottom-0 mt-6 -mx-6 px-6 py-4 bg-white/80 dark:bg-gray-900/60 backdrop-blur border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3">
        <Link href={"/dashboard/warehouses"}>
          <Button type="button" variant="secondary">
            Cancelar
          </Button>
        </Link>
        {hasCreatePermission && (
          <Button
            form="warehouse-form"
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
