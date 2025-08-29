import React from "react";
import { WarehouseTransferForm } from "../components/warehouse-transfer-form/warehouse-transfer-form";
import { InventoryProductItem } from "@/services/inventory-providers";

type Props = {
  warehouseId: number;
  productVariants: InventoryProductItem[];
};
const WarehouseTransferContainer = ({
  warehouseId,
  productVariants,
}: Props) => {
  return (
    <div className="panel">
      <WarehouseTransferForm
        warehouseId={warehouseId}
        productVariants={productVariants}
      />
    </div>
  );
};

export default WarehouseTransferContainer;
