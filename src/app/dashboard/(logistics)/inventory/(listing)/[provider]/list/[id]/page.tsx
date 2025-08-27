import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getInventoryById } from "@/services/inventory-providers";
import InventoryProviderEditContainer from "@/sections/inventory-provider/containers/inventory-provider-edit-container";
import { InventoryDetailSkeleton } from "@/sections/inventory/inventory-detail-view";

import { getUserProviderById } from "@/services/users";
import { InventoryStoreFormData } from "@/sections/inventory-provider/schemas/inventory-edit.schema";

export const metadata = {
  title: "Editar Inventario - ZAS Express",
};

// fallback moved to shared InventoryDetailSkeleton

interface EditPageProps {
  params: Promise<{ id: string; provider: string }>;
}

export default async function InventoryEditPage({ params }: EditPageProps) {
  const { id, provider } = await params;
  const res = await getInventoryById(id);
  const resSupplier = await getUserProviderById(Number(provider));

  if (!res || res.error || !res.data) notFound();
  if (!resSupplier || resSupplier.error || !resSupplier.data) notFound();

  return (
    <Suspense fallback={<InventoryDetailSkeleton />}>
      <InventoryProviderEditContainer
        inventory={res.data! as unknown as InventoryStoreFormData}
        userProvider={resSupplier?.data}
      />
    </Suspense>
  );
}
