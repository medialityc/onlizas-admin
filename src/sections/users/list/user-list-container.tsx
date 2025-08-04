"use client";

import { UserList } from "@/sections/users/list/user-list";
import { GetAllUsersResponse } from "@/types/users";
import { use } from "react";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";

// TODO: Separa este tipo a otro lado
interface UserListPageProps {
  usersPromise: Promise<ApiResponse<GetAllUsersResponse>>;
  query: SearchParams;
}

export default function UserListContainer({
  usersPromise,
  query,
}: UserListPageProps) {
  const userResponse = use(usersPromise);
  const { updateFiltersInUrl } = useFiltersUrl();
  // TODO manejar correctamente el error
  useFetchError(userResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {/* [FIX-AUTH]: Aqui significa que el token expiro */}
      {userResponse.status == 401 && <SessionExpiredAlert />}
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
          data={userResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
