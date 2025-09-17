import { detailsObjectToArray, isValidUrl } from "@/utils/format";
import { ProductFormData } from "../schema/product-schema";
import { Product } from "@/types/products";

export const productTransformData = (
  product: ProductFormData | Product
): ProductFormData => {
  return {
    ...product,
    isActive: product.state || product.isActive,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    about: product?.about?.map((a) => ({ value: a })),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    categoryIds: product.categories.map((c) => c.id),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    supplierUserIds: product.suppliers.map((s) => s.id),
    image: isValidUrl(product.image as string) ? product?.image : "",
    details: detailsObjectToArray(product.details),
  };
};
