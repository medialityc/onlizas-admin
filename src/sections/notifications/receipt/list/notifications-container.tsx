"use client";

import { UserList } from "@/sections/users/list/user-list";
import type { GetAllUsersResponse } from "@/types/users";
import { use } from "react";
import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
import { UserNotificationsList } from "./notifications-list";
import { GetAllNotificationByUserResponse } from "@/types/notifications";

interface UserListPageProps {
  usersNotificationsPromise: Promise<
    ApiResponse<GetAllNotificationByUserResponse>
  >;
  query: SearchParams;
}
export default function UserNotificationContainer({
  usersNotificationsPromise,
  query,
}: UserListPageProps) {
  const userNotificationsResponse = use(usersNotificationsPromise);
  const { updateFiltersInUrl } = useFiltersUrl();

  const { hasError, status } = useFetchError(userNotificationsResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {status === 401 && <SessionExpiredAlert />}
      {hasError && status !== 401 && (
        <div className="alert alert-error">
          Ocurrió un error al cargar las notificaciones.
        </div>
      )}

      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Notificaciones
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestiona tus notificaciones
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary">Notificar</button>
          </div>
        </div>

        {!hasError && (
          <UserNotificationsList
            data={userNotificationsResponse?.data}
            searchParams={query}
            onSearchParamsChange={handleSearchParamsChange}
          />
        )}
      </div>
    </div>
  );
}
