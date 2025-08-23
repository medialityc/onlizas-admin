import InventoryProviderCreateContainer from "@/sections/inventory-provider/containers/inventory-provider-create-container";

export const metadata = {
  title: "Crear Inventario - ZAS Express",
};

type Props = {
  params: Promise<{ provider: string }>;
};

export default async function InventoryPage({ params }: Props) {
  const { provider } = await params;

  // todo get one provider

  return (
    <InventoryProviderCreateContainer
      userProvider={{ id: Number(provider) } as any}
    />
  );
}
