import { getProductById } from "@/services/products";
import { notFound } from "next/navigation";
import SupplierProductEditContainer from "@/sections/products/containers/supplier-product-edit-container";
import { supplierProductTransformData } from "@/sections/products/utils/supplier-product-transform-data";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Next 15 params es una Promesa
  const response = await getProductById(Number(id));
  if (!response?.data) notFound();

  const product = response.data;

  return (
    <SupplierProductEditContainer
      product={supplierProductTransformData(product)}
    />
  );
}
