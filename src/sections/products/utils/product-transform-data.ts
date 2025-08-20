import { ProductFormData } from "../schema/product-schema";

export const productTransformData = (
  product: ProductFormData
): ProductFormData => {
  return {
    ...product,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    about: product?.about?.map((a) => ({ value: a })),
  };
};
