import React from "react";
import { WarehouseTransferForm } from "../components/warehouse-transfer-form/warehouse-transfer-form";
import { WarehouseFormData } from "../schemas/warehouse-schema";

type Props = {
  warehouse: WarehouseFormData;
};

const WarehouseTransferContainer = React.forwardRef<HTMLDivElement, Props>(
  ({ warehouse }, ref) => {
    return (
      <div ref={ref} className="panel">
        <WarehouseTransferForm warehouse={warehouse} />
      </div>
    );
  }
);

WarehouseTransferContainer.displayName = "WarehouseTransferContainer";

export default WarehouseTransferContainer;
