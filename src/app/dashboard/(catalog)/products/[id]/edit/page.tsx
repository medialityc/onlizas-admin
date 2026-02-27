import { notFound } from "next/navigation";
import ProductEditContainer from "@/sections/products/containers/product-edit-container";
import SupplierProductEditContainer from "@/sections/products/containers/supplier-product-edit-container";
import { getProductById } from "@/services/products";
import { getModulePermissions } from "@/components/permission/server-permission-wrapper";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getProductById(id);
  if (!response?.data) notFound();

  const product = response.data;

  const { isAdmin, isSupplier } = await getModulePermissions("products");

  if (isAdmin) {
    return <ProductEditContainer product={product as any} />;
  }

  if (isSupplier) {
    return <SupplierProductEditContainer product={product as any} />;
  }

  return (
    <div className="panel p-6">
      <h2 className="text-lg font-semibold mb-2">Gestión de Productos</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No tiene permisos para editar productos.
      </p>
    </div>
  );
}
