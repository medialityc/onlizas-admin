import InventoryProviderCreateContainer from "@/sections/inventory-provider/containers/inventory-provider-create-container";
import { getAllProviderStores } from "@/services/stores";
import { getUserProviderById } from "@/services/users";
import { Suspense } from "react";

export const metadata = {
  title: "Crear Inventario - ZAS Express",
};

type Props = {
  params: Promise<{ provider: string }>;
};

export default async function InventoryPage({ params }: Props) {
  const { provider } = await params;

  const userProvider = await getUserProviderById(Number(provider));
  const stores = await getAllProviderStores(provider, {});

  return (
    <Suspense>
      <InventoryProviderCreateContainer
        userProvider={userProvider}
        stores={stores}
      />
    </Suspense>
  );
}
