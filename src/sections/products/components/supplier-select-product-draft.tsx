"use client";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllProducts } from "@/services/products";
import React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import ImagePreview from "@/components/image/image-preview";
import { detailsObjectToArray, isValidUrl } from "@/utils/format";
import { SupplierProductFormData } from "../schema/supplier-product-schema";
import { ProductFormData } from "../schema/product-schema";

const ProductOptionRender = ({
  option,
}: {
  option: SupplierProductFormData;
}) => {
  const firstImage = isValidUrl(option?.image as string)
    ? (option?.image as string)
    : "/assets/images/placeholder-product.webp";

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-slate-700"
      )}
    >
      <ImagePreview
        className="w-10 h-10"
        images={[firstImage]}
        alt={option.name}
        previewEnabled={false}
      />
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {option.name}
        </h4>
        {option.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {option.description}
          </p>
        )}
      </div>
      {option.details && Object.keys(option.details).length > 0 && (
        <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
          {Object.keys(option.details).length} detalles
        </span>
      )}
    </div>
  );
};

const SupplierSelectProductDraft = () => {
  const { setValue } = useFormContext();

  const handleProductSelected = (product: ProductFormData) => {
    if (!product) return;

    // Actualizar los campos del formulario con la información del producto
    setValue("id", product?.id);
    setValue("isDraft", false);
    setValue("selectedProduct", product); // Guardar el producto completo para el resumen
    setValue("name", product.name);
    setValue("description", product.description || "");
    setValue("length", product?.length);
    setValue("width", product?.width);
    setValue("height", product?.height);
    setValue("weight", product?.weight);
    setValue("isActive", product?.isActive);
    setValue(
      "categoryIds",
      product?.categories?.map((cat: any) => cat?.id || cat)
    );
    setValue("aboutThis", product?.aboutThis);
    setValue("details", detailsObjectToArray(product?.details));
    setValue("detailsArray", detailsObjectToArray(product?.details));
    setValue(
      "image",
      isValidUrl(product?.image as string) ? product?.image : null
    );
  };

  return (
    <div className="space-y-2">
      <RHFAutocompleteFetcherInfinity
        name="productId"
        label="Seleccionar Producto"
        placeholder="Buscar producto..."
        onFetch={getAllProducts as any}
        objectValueKey="id"
        objectKeyLabel="name"
        queryKey="products-draft"
        required
        onOptionSelected={handleProductSelected}
        renderOption={(option) => <ProductOptionRender option={option} />}
        className="bg-white dark:bg-slate-800"
      />
    </div>
  );
};

export default SupplierSelectProductDraft;
