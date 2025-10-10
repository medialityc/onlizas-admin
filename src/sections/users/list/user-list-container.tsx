"use client";

import { UserList } from "@/sections/users/list/user-list";
import { GetAllUsersResponse } from "@/types/users";
import useFiltersUrl from "@/hooks/use-filters-url";
import { SearchParams } from "@/types/fetch/request";

interface UserListPageProps {
  usersPromise: GetAllUsersResponse;
  query: SearchParams;
}

export default function UserListContainer({
  usersPromise,
  query,
}: UserListPageProps) {
  const { updateFiltersInUrl } = useFiltersUrl();

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Usuarios
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Administra los usuarios del sistema y sus permisos
            </p>
          </div>
        </div>

        <UserList
          data={usersPromise}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
