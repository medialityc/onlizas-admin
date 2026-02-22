import React from "react";
import { WarehouseForm } from "../components/warehouse-form/warehouse-form";

type Props = {
  afterCreateRedirectTo?: string;
};

const WarehouseCreateContainer = ({ afterCreateRedirectTo }: Props) => {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          Crear Almacén
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Crea un almacén físico o virtual
        </p>
      </div>
      <WarehouseForm afterCreateRedirectTo={afterCreateRedirectTo} />
    </div>
  );
};

export default WarehouseCreateContainer;
