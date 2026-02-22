import React from "react";
import ProductForm from "../components/product-form";

type Props = {
  afterCreateRedirectTo?: string;
};

const ProductCreateContainer = ({ afterCreateRedirectTo }: Props) => {
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
      <ProductForm afterCreateRedirectTo={afterCreateRedirectTo} />
    </div>
  );
};

export default ProductCreateContainer;
