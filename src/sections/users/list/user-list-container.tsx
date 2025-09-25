"use client";

import { UserList } from "@/sections/users/list/user-list";
import { GetAllUsersResponse } from "@/types/users";
import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";

interface UserListPageProps {
  users: ApiResponse<GetAllUsersResponse>;
  query: SearchParams;
}

export default function UserListContainer({ users, query }: UserListPageProps) {
  const { updateFiltersInUrl } = useFiltersUrl();
  
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

const hasError = users.error;
const status = users.status;
const message = users.message || "Ocurrió un error al cargar los usuarios.";
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

        {/* Mostrar mensaje de error si lo hay */}
        {hasError && status !== 401 ? (
          <div className="text-center text-red-500 py-4">{message}</div>
        ) : users.data?.data.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No hay usuarios para mostrar
          </div>
        ) : (
          <UserList
            data={users.data}
            searchParams={query}
            onSearchParamsChange={handleSearchParamsChange}
          />
        )}
      </div>
    </div>
  );
}
