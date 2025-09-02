import { detailsObjectToArray, isValidUrl } from "@/utils/format";
import { Product } from "@/types/products";
import { SupplierProductFormData } from "../schema/supplier-product-schema";
import { ProductFormData } from "../schema/product-schema";

export const supplierProductTransformData = (
  product: ProductFormData | Product
): SupplierProductFormData => {
  console.log(product, "SIN EDITAR");
  return {
    ...product,
    isActive: product?.state,
    isDraft: true, // define si es un formulario common y no link
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    about: product?.about?.map((a) => ({ value: a })),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    categoryIds: product.categories.map((c) => c.id),
    image: isValidUrl(product.image as string) ? product?.image : undefined,
    details: detailsObjectToArray(product.details),
  };
};
