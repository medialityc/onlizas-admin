import React from "react";
import { WarehouseTransferForm } from "../components/warehouse-transfer-form/warehouse-transfer-form";

type Props = {
  warehouseId: number;
};
const WarehouseTransferContainer = ({ warehouseId }: Props) => {
  return (
    <div className="panel">
      <WarehouseTransferForm warehouseId={warehouseId} />
    </div>
  );
};

export default WarehouseTransferContainer;
