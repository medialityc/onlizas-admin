import { buildQueryParams } from "@/lib/request";

import UserSupplierCardListContainer from "@/sections/inventory-provider/containers/user-supplier-card-list-container";
import { getAllSupplierUsers } from "@/services/users";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usuarios proveedores - ZAS Express",
  description: "Listado de usuarios proveedores",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function UserProviderPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const supplierUsers = await getAllSupplierUsers({ ...query, active: true });

  return (
    <UserSupplierCardListContainer
      supplierUsers={supplierUsers}
      query={params}
    />
  );
}

export default UserProviderPage;
