import { detailsObjectToArray } from "@/utils/format";
import { ProductFormData } from "../schema/product-schema";
import { Product } from "@/types/products";

export const productTransformData = (
  product: ProductFormData | Product
): ProductFormData => {
  return {
    ...product,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    about: product?.about?.map((a) => ({ value: a })),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    categoryIds: product.categories?.map((c) => c.id) || [],
    detailsArray: detailsObjectToArray(product.details),
  };
};
