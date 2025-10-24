import InventoryProviderEditContainer from "@/sections/inventory-provider/containers/inventory-provider-edit-container";
import { getInventoryById } from "@/services/inventory-providers";
import { getCategoryFeatures } from "@/services/products";
import { getUserProviderById } from "@/services/users";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Editar Inventario - ZAS Express",
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function InventoryEditPage({ params }: EditPageProps) {
  const { id } = await params;
  const res = await getInventoryById(id);
  if (!res || res.error || !res.data) notFound();

  console.log(res.data, "inventory data");

  const resFeatures = await getCategoryFeatures(res.data?.categoryIds ?? []);

  return (
    <InventoryProviderEditContainer
      inventory={res.data}
      features={resFeatures?.data?.features ?? []}
    />
  );
}
