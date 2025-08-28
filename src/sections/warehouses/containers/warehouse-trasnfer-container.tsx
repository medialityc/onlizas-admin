import React from "react";
import { WarehouseTransferForm } from "../components/warehuse-transfer-form/warehouse-transfer-form";

type Props = {
  warehouseId: number;
};
const WarehouseTransferContainer = ({ warehouseId }: Props) => {
  return (
    <div className="panel">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          Crear Almacén
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Crea un almacén físico o virtual
        </p>
      </div>
      <WarehouseTransferForm warehouseId={warehouseId} />
    </div>
  );
};

export default WarehouseTransferContainer;
