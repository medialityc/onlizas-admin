import { notFound } from "next/navigation";
import ProductEditContainer from "@/sections/products/containers/product-edit-container";
import { getProductById } from "@/services/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getProductById(Number(id));
  if (!response?.data) notFound();

  const product = response.data;

  return <ProductEditContainer product={product as any} />;
}
