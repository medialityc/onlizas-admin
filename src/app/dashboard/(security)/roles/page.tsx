import { buildQueryParams } from "@/lib/request";
import RoleListContainer from "@/sections/roles/list/role-list-container";
import { getAllRoles } from "@/services/roles";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Roles - ZAS Express",
  description: "Administra los roles del sistema y sus permisos",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function RoleListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const rolesPromise = await getAllRoles(query);

  return <RoleListContainer rolesPromise={rolesPromise} query={params} />;
}

export default RoleListPage;
