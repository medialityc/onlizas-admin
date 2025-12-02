import StoresServerWrapper from "@/sections/stores/list/stores-server-wrapper";
import { Suspense } from "react";
import { Metadata } from "next";
import SkeletonStoreList from "@/sections/stores/list/components/skeleton";

export const metadata: Metadata = {
  title: "Gestión de Tiendas - Onlizas",
  description: "Administra las tiendas del sistema",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

/**
 * Página de tiendas - Server Component
 *
 * Utiliza el nuevo StoresServerWrapper que:
 * - Obtiene permisos en el servidor (sin delay de cliente)
 * - Pre-fetchea datos según el rol del usuario
 * - Renderiza el componente apropiado (admin/supplier)
 */
export default async function StoresListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const params = await searchParams;

  return (
    <Suspense fallback={<SkeletonStoreList />}>
      <StoresServerWrapper query={params} />
    </Suspense>
  );
}
