import React from "react";
import { MeWarehouseForm } from "../components/warehouse-form/me-warehouse-form";

const MeWarehouseCreateContainer = () => {
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
      <MeWarehouseForm />
    </div>
  );
};

export default MeWarehouseCreateContainer;
