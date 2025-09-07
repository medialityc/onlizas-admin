import { notFound } from "next/navigation";

import { getInventoryById } from "@/services/inventory-providers";
import InventoryProviderEditContainer from "@/sections/inventory-provider/containers/inventory-provider-edit-container";

import { getUserProviderById } from "@/services/users";
import { InventoryStoreFormData } from "@/sections/inventory-provider/schemas/inventory-edit.schema";
import { getCategoryFeatures } from "@/services/products";

export const metadata = {
  title: "Editar Inventario - ZAS Express",
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function InventoryEditPage({ params }: EditPageProps) {
  const { id } = await params;
  const res = await getInventoryById(id);
  const resSupplier = await getUserProviderById(Number(res.data?.supplierId));
  const resFeatures = await getCategoryFeatures(res.data?.categoryIds ?? []);

  if (!res || res.error || !res.data) notFound();
  if (!resSupplier || resSupplier.error || !resSupplier.data) notFound();

  return (
    <InventoryProviderEditContainer
      inventory={res.data! as unknown as InventoryStoreFormData}
      userProvider={resSupplier?.data}
      features={resFeatures?.data?.features ?? []}
    />
  );
}
