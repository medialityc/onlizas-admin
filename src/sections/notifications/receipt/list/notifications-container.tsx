"use client";

import { UserList } from "@/sections/users/list/user-list";
import { GetAllUsersResponse } from "@/types/users";
import { use } from "react";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
import { UserNotificationsList } from "./notifications-list";
import { GetAllNotificationByUserResponse } from "@/types/notifications";

// TODO: Separa este tipo a otro lado
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
  // TODO manejar correctamente el error
  useFetchError(userNotificationsResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {userNotificationsResponse.status == 401 && <SessionExpiredAlert />}
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

        <UserNotificationsList
          data={userNotificationsResponse?.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
