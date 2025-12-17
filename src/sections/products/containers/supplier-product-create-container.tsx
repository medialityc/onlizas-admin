import React from "react";
import SupplierProductForm from "../components/supplier-product-form";

const SupplierProductCreateContainer = () => {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          Crear Product
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define el producto y sus características
        </p>
      </div>
      <SupplierProductForm />
    </div>
  );
};

export default SupplierProductCreateContainer;
