"use client";

import { useNotifications } from "../hooks/use-notifications";
import { NotificationItem } from "./notification-item";
import { NotificationQuestion } from "./notification-question";
import { NotificationEmpty } from "./notification-empty";
import Dropdown from "@/components/ui/dropdown";
import IconBellBing from "@/components/icon/icon-bell-bing";

export function NotificationBell() {
  const { notifications, unreadCount, connecting, loadingNotifications } =
    useNotifications();

  return (
    <Dropdown
      offset={[0, 8]}
      placement="bottom-end"
      btnClassName={`relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60 ${loadingNotifications ? "pointer-events-none opacity-60" : ""}`}
      button={
        <span className="relative">
          {loadingNotifications ? (
            <svg
              className="h-5 w-5 animate-spin text-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            <IconBellBing className="h-5 w-5" />
          )}
          {!loadingNotifications && connecting && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
            </span>
          )}
          {!loadingNotifications && !connecting && unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white shadow">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </span>
      }
    >
      <div className="w-80 overflow-hidden rounded-xl shadow-lg sm:w-96">
        {/* Header */}
        <div className="flex items-center justify-between bg-linear-to-r from-primary to-primary/80 px-4 py-3">
          <div className="flex items-center gap-2">
            <IconBellBing className="h-4 w-4 text-white" />
            <h4 className="text-sm font-semibold text-white">Notificaciones</h4>
          </div>
          {unreadCount > 0 && (
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              {unreadCount > 99 ? "99+" : unreadCount} sin leer
            </span>
          )}
        </div>

        {/* List */}
        <ul className="max-h-105 my-0 py-0 overflow-y-auto">
          {notifications.length === 0 ? (
            <NotificationEmpty key={0} />
          ) : (
            notifications.map((notif, index) =>
              notif.notificationType === "Question" && !notif.response ? (
                <NotificationQuestion
                  key={notif.notificationId}
                  notification={notif}
                />
              ) : (
                <NotificationItem
                  key={`${notif.notificationId}-${index}`}
                  notification={notif}
                />
              ),
            )
          )}
        </ul>
      </div>
    </Dropdown>
  );
}
