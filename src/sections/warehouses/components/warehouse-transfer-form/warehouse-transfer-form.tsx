"use client";

import { FormProvider } from "@/components/react-hook-form";
import { Button } from "@/components/button/button";
import Link from "next/link";
import { useWarehouseTransferForm } from "../../hooks/use-warehouse-transfer-form";
import { WarehouseTransferFormData } from "../../schemas/warehouse-transfer-schema";

import WarehouseInventoryList from "./componnets/warehouse-inventory-list";
import WarehouseTransferItemForm from "./warehouse-transfer-item-from";

type Props = {
  warehouseId: number;
};
export function WarehouseTransferForm({ warehouseId }: Props) {
  const initValue: WarehouseTransferFormData = {
    destinationWarehouseId: 0,
    originWarehouseId: warehouseId,
    items: [],
    inventories: [],
    transferNumber: 0,
  };

  const { form, isPending, onSubmit } = useWarehouseTransferForm(initValue);

  return (
    <FormProvider
      methods={form}
      onSubmit={onSubmit}
      id="warehouse-transfer-form"
      noValidate
    >
      <div className="grid grid-cols-1  gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* variantes */}
          <WarehouseInventoryList warehouseId={warehouseId} />

          {/* form items */}
          <WarehouseTransferItemForm warehouseId={warehouseId} />
        </div>
        {/* <pre> {JSON.stringify(productVariants, null, 2)} </pre> */}
      </div>
      {/* Actions stickies */}
      <div className="sticky bottom-0 mt-6 -mx-6 px-6 py-4 bg-white/80 dark:bg-gray-900/60 backdrop-blur border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3">
        <Link href={"/dashboard/warehouses"}>
          <Button type="button" variant="secondary" outline>
            Cancelar
          </Button>
        </Link>
        <Button
          form="warehouse-transfer-form"
          type="submit"
          variant="primary"
          disabled={isPending}
        >
          {isPending ? "Transfiriendo..." : "Transferir productos"}
        </Button>
      </div>
    </FormProvider>
  );
}
