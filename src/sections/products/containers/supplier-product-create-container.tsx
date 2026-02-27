import React from "react";
import SupplierProductForm from "../components/supplier-product-form";
import { getSupplierApprovalProcess } from "@/services/supplier";

const SupplierProductCreateContainer = async () => {
  const { data: approvalProcess } = await getSupplierApprovalProcess();
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          Crear Producto
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define el producto y sus características
        </p>
      </div>
      <SupplierProductForm approvalProcess={approvalProcess} />
    </div>
  );
};

export default SupplierProductCreateContainer;
