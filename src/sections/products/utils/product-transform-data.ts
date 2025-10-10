import { detailsObjectToArray, isValidUrl } from "@/utils/format";
import { ProductFormData } from "../schema/product-schema";
import { Product } from "@/types/products";

export const productTransformData = (product: Product): ProductFormData => {
  return {
    ...product,

    // Normalizamos isDurable
    isDurable: product.isDurable ?? false,
    active: product.state ?? false,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    about: product?.aboutThis?.map((a) => ({ value: a })) ?? [],

    categoryIds: product.categories?.map((c) => c.id) ?? [],

    supplierUserIds: product.suppliers?.map((s) => s.id) ?? [],

    image: isValidUrl(product.image as string) ? product.image : "",

    details: detailsObjectToArray(product.details) ?? [],

    // 👇 Valores de Aduana normalizados
    customsValue: product.customsValue ?? 0,
    valuePerUnit: product.customsValueAduanaUsd ?? 0,
    customCategory: product.aduanaCategory?.chapterName ?? "",
  };
};
