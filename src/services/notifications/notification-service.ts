import { ApiResponse } from "@/types/fetch/api";
import {
  CreateNotificationPayload,
  GetAllNotificationByUserResponse,
  Notification,
  NotificationChannel,
  NotificationPriority,
  UserNotification,
} from "@/types/notifications";
import { nextAuthFetch } from "../utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { IQueryable } from "@/types/fetch/request";
import { QueryParamsURLFactory } from "@/lib/request";
import { mockNotifications } from "@/sections/notifications/mock/data";
import { CreateNotificationSchema } from "@/sections/notifications/receipt/create/notification-create-schema";
/* import { revalidateTag } from "next/cache"; */

export const createNotification = async (
  payload: FormData
): Promise<ApiResponse<Notification>> => {
  // Mock para desarrollo

  /*    return {
      success: true,
      data: { success: true },
      message: "Notificación creada exitosamente",
      status: 201,
    }; */

  const res = await nextAuthFetch({
    url: backendRoutes.notifications.create,
    method: "POST",
    useAuth: true,
    data: payload,
  });

  if (!res.ok) return handleApiServerError(res);
  /* revalidateTag("notification"); */
  return buildApiResponseAsync<Notification>(res);
};
/* export const getNotificationById = async (
  id: number
): Promise<ApiResponse<GetAllNotificationByUserResponse>> => {
  const res = await nextAuthFetch({
    url: backendRoutes.notifications.getById(id),
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllNotificationByUserResponse>(res);
}; */
export const getNotificationsByUser = async (
  params: IQueryable,
  token?: string | undefined
): Promise<ApiResponse<GetAllNotificationByUserResponse>> => {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.notifications.userNotifications
  ).build();
  const res = await nextAuthFetch({
    url: url,
    method: "GET",
    useAuth: true,
    token: token,
  });
  return mockNotifications;

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllNotificationByUserResponse>(res);
};

/* export const getUnreadNotificationsCount = async (
  token: string | undefined
): Promise<ApiResponse<number>> => {
  const url = backendRoutes.notifications.unreadCount;
  const res = await nextAuthFetch({
    url: url,
    method: "GET",
    useAuth: true,
    token: token,
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<number>(res);
}; */

// Marcar como leída
/* export const markAsRead = async (
  notificationId: number
): Promise<ApiResponse<void>> => {
  const res = await nextAuthFetch({
    url: backendRoutes.notifications.markAsRead(notificationId),
    method: "PUT",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<void>(res);
};

export const markAllAsRead = async (): Promise<ApiResponse<void>> => {
  const res = await nextAuthFetch({
    url: backendRoutes.notifications.markAllAsRead,
    method: "PUT",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<void>(res);
}; */

export const deleteNotification = async (
  id: number
): Promise<ApiResponse<void>> => {
  const res = await nextAuthFetch({
    url: backendRoutes.notifications.delete(id),
    method: "DELETE",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<void>(res);
};

/* export const getPersonalStats = async (): Promise<
  ApiResponse<{
    total: number;
    unread: number;
    read: number;
    byPriority: Record<string, number>;
    byType: Record<string, number>;
    last30Days: Array<{
      date: string;
      count: number;
    }>;
  }>
> => {
  const res = await nextAuthFetch({
    url: backendRoutes.notifications.stats,
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<{
    total: number;
    unread: number;
    read: number;
    byPriority: Record<string, number>;
    byType: Record<string, number>;
  }>(res);
};
 */
