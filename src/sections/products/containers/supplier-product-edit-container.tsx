import React from "react";
import SupplierProductForm from "../components/supplier-product-form";
import { supplierProductTransformData } from "../utils/supplier-product-transform-data";
import { Product } from "@/types/products";
import { getSupplierApprovalProcess } from "@/services/supplier";

type Props = {
  product: Product;
};

const SupplierProductEditContainer = async ({ product }: Props) => {
  const { data: approvalProcess } = await getSupplierApprovalProcess();

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          Editar Producto
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define el producto y sus características
        </p>
      </div>
      <SupplierProductForm
        initValue={supplierProductTransformData(product)}
        approvalProcess={approvalProcess}
        isEdit
      />
    </div>
  );
};

export default SupplierProductEditContainer;
