import { buildQueryParams } from "@/lib/request";
import UserListContainer from "@/sections/users/list/user-list-container";
import { getAllUsers } from "@/services/users";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Usuarios - ZAS Express",
  description: "Gestionar usuarios del sistema y sus permisos",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function UserListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const users = await getAllUsers(query);
  return <UserListContainer users={users} query={params} />;
}

export default UserListPage;
