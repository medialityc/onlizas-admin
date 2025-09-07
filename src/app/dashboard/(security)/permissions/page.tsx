import { buildQueryParams } from "@/lib/request";
import PermissionListContainer from "@/sections/permissions/list/permissions-list-container";
import { getAllPermissions } from "@/services/permissions";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Permisos - ZAS Express",
  description: "Administra los permisos del sistema organizados por roles",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function PermissionListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const permissionsPromise = await getAllPermissions(query);

  return (
    <PermissionListContainer
      permissionsPromise={permissionsPromise}
      query={params}
    />
  );
}

export default PermissionListPage;
