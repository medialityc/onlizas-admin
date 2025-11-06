import WarehousePermissionWrapper from "@/sections/warehouses/containers/warehouse-permission-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Almacenes General - ZAS Express",
  description: "Gestión de almacenes del sistema",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

export default async function WarehousesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const params = await searchParams;
  // Delegamos lógica de permisos y fetching al wrapper (cliente)
  return <WarehousePermissionWrapper query={params} />;
}
