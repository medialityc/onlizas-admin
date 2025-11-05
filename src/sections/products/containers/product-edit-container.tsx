import React from "react";
import ProductForm from "../components/product-form";
import { productTransformData } from "../utils/product-transform-data";
import { Product } from "@/types/products";

type Props = {
  product: Product;
};
const ProductEditContainer = ({ product }: Props) => {
  return (
    <div className="panel">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          Editar Producto
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define el producto y sus características
        </p>
      </div>
      <ProductForm initValue={productTransformData(product)} />
    </div>
  );
};

export default ProductEditContainer;
