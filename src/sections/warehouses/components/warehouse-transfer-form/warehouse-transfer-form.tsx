"use client";

import { FormProvider } from "@/components/react-hook-form";
import { Button } from "@/components/button/button";
import Link from "next/link";
import { useWarehouseTransferForm } from "../../hooks/use-warehouse-transfer-form";
import WarehouseInventoryList from "./componnets/warehouse-inventory-list";
import WarehouseTransferItemForm from "./warehouse-transfer-item-from";
import { WarehouseFormData } from "../../schemas/warehouse-schema";
import { useMemo } from "react";
import { WarehouseTransferFormData } from "../../schemas/warehouse-transfer-schema";
import { AlertBox } from "@/components/alert/alert-box";
import { CircleAlertIcon } from "lucide-react";
import { useWarehouseInventoryActions } from "../../contexts/warehouse-inventory-transfer.stote";
import { generateWarehouseTransferNumber } from "../../utils/warehouse";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { usePermissions } from "@/hooks/use-permissions";

type Props = {
  warehouse: WarehouseFormData;
};
export function WarehouseTransferForm({ warehouse }: Props) {
  const warehouseId = warehouse?.id;
  const { items } = useWarehouseInventoryActions();
  const initValue = useMemo(
    (): WarehouseTransferFormData => ({
      originId: warehouseId ?? "",
      destinationId: "",
      items: [],
      transferNumber: generateWarehouseTransferNumber(),
    }),
    [warehouseId]
  );

  const { form, isPending, onSubmit } = useWarehouseTransferForm(initValue);

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([
    PERMISSION_ENUM.RETRIEVE,
    PERMISSION_ENUM.SUPPLIER_RETRIEVE,
    PERMISSION_ENUM.SUPPLIER_UPDATE,
  ]);

  return (
    <FormProvider
      methods={form}
      onSubmit={onSubmit}
      id="warehouse-transfer-form"
      noValidate
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {/* variantes */}
          <WarehouseInventoryList warehouse={warehouse} />

          {form?.formState?.errors?.items?.message && items?.length === 0 && (
            <AlertBox
              message={form?.formState?.errors?.items?.message}
              variant={"danger"}
              title={"Error"}
              icon={<CircleAlertIcon />}
            />
          )}

          {/* form items */}
          <WarehouseTransferItemForm />
        </div>
      </div>
      {/* Actions stickies */}
      <div className="sticky bottom-0 mt-6 -mx-6 px-6 py-4 bg-white/80 dark:bg-gray-900/60 backdrop-blur border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3">
        <Link href={"/dashboard/warehouses"}>
          <Button type="button" variant="secondary" outline>
            Cancelar
          </Button>
        </Link>
        {hasUpdatePermission && (
          <Button
            form="warehouse-transfer-form"
            type="submit"
            variant="primary"
            disabled={isPending}
          >
            {isPending ? "Transfiriendo..." : "Transferir productos"}
          </Button>
        )}
      </div>
    </FormProvider>
  );
}
