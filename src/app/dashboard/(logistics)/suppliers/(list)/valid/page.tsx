import { buildQueryParams } from "@/lib/request";
import SuppliersListContainer from "@/sections/suppliers/list/suppliers-list-container";
import { getValidSuppliers } from "@/services/supplier";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Solicitudes aprobadas - Onlizas",
  description:
    "Administra las solicitudes aprobadas del sistema y sus datos asociados",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function SuppliersListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const suppliersPromise = await getValidSuppliers(query);

  return (
    <SuppliersListContainer
      suppliersPromise={suppliersPromise}
      query={params}
    />
  );
}

export default SuppliersListPage;
