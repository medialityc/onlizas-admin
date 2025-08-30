import React from "react";
import { WarehouseTransferForm } from "../components/warehouse-transfer-form/warehouse-transfer-form";
import { WarehouseFormData } from "../schemas/warehouse-schema";

type Props = {
  warehouse: WarehouseFormData;
};
const WarehouseTransferContainer = ({ warehouse }: Props) => {
  return (
    <div className="panel">
      <WarehouseTransferForm warehouse={warehouse} />
    </div>
  );
};

export default WarehouseTransferContainer;
