"use server";

import { backendRoutes } from "@/lib/endpoint";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { ApiResponse } from "@/types/fetch/api";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";

export async function getUnreadNotificationsCount(): Promise<number> {
  const res = await nextAuthFetch({
    url: backendRoutes.notifications.unreadCount,
    method: "GET",
    useAuth: true,
    cache: "no-cache",
  });

  if (!res.ok) return 0;

  try {
    const data = await res.json();
    // El endpoint puede devolver { count: number } o directamente un número
    if (typeof data === "number") return data;
    if (typeof data?.count === "number") return data.count;
    if (typeof data?.unreadCount === "number") return data.unreadCount;
    return 0;
  } catch {
    return 0;
  }
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<ApiResponse<any>> {
  const res = await nextAuthFetch({
    url: backendRoutes.notifications.markRead(notificationId),
    method: "POST",
    useAuth: true,
    data: {
      notificationId,
      systemId: "onlizas",
      clientIdentifier: "web-browser-chrome",
    },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync(res);
}

export async function respondToNotification(
  notificationId: string,
  response: string,
): Promise<ApiResponse<any>> {
  const res = await nextAuthFetch({
    url: backendRoutes.notifications.respond(notificationId),
    method: "POST",
    useAuth: true,
    data: { response },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync(res);
}
