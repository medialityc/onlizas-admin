import { buildQueryParams } from "@/lib/request";
import UserListContainer from "@/sections/users/list/user-list-container";
import { getAllUsers } from "@/services/users";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Gestión de Usuarios - ZAS Express",
  description: "Gestionar usuarios del sistema y sus permisos",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};
// TODO: Separar esto en otro archivo

interface PageProps {
  searchParams: Promise<SearchParams>;
}
// TODO: Separar en otro componente
function UserListSkeleton() {
  return (
    <div className="panel">
      <div className="mb-5">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="flex gap-4 mb-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-64"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
      </div>
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

async function UserListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const users = await getAllUsers(query);
  return (
    <Suspense fallback={<UserListSkeleton />}>
      <UserListContainer users={users} query={params} />
    </Suspense>
  );
}

export default UserListPage;
