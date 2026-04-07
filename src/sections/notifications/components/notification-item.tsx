"use client";

import { useNotifications } from "../hooks/use-notifications";
import type { AppNotification } from "../types/notification.types";
import IconCircleCheck from "@/components/icon/icon-circle-check";
import IconClock from "@/components/icon/icon-clock";

interface Props {
  notification: AppNotification;
}

const PRIORITY_STYLES: Record<
  string,
  { bar: string; badge: string; label: string }
> = {
  Low: {
    bar: "bg-success",
    badge: "bg-success/10 text-success",
    label: "Baja",
  },
  Medium: {
    bar: "bg-warning",
    badge: "bg-warning/10 text-warning",
    label: "Media",
  },
  High: { bar: "bg-danger", badge: "bg-danger/10 text-danger", label: "Alta" },
  Critical: {
    bar: "bg-danger animate-pulse",
    badge: "bg-danger/20 text-danger font-semibold",
    label: "Crítica",
  },
};

export function NotificationItem({ notification }: Props) {
  const { markAsRead, loadingIds } = useNotifications();
  const priority = PRIORITY_STYLES[notification.priority];
  const isLoading = loadingIds.has(notification.notificationId);

  const handleClick = () => {
    if (!notification.isRead && !isLoading)
      markAsRead(notification.notificationId);
  };

  return (
    <li key={notification.notificationId} onClick={(e) => e.stopPropagation()}>
      <div
        onClick={handleClick}
        className={`group relative flex gap-3 px-4 py-3.5 transition-colors ${
          isLoading
            ? "cursor-wait opacity-60"
            : "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
        } ${!notification.isRead ? "bg-primary/5 dark:bg-primary/10" : ""}`}
      >
        {/* Left priority bar */}
        <span
          className={`absolute inset-y-0 left-0 w-0.5 rounded-full ${priority?.bar ?? "bg-gray-300"}`}
        />

        {/* Icon / spinner */}
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            notification.isRead
              ? "bg-gray-100 dark:bg-white/10"
              : "bg-primary/10"
          }`}
        >
          {isLoading ? (
            <svg
              className="h-4 w-4 animate-spin text-primary"
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
            <IconCircleCheck
              className={`h-4 w-4 ${notification.isRead ? "text-gray-400" : "text-primary"}`}
            />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`truncate text-sm font-medium ${
                notification.isRead
                  ? "text-gray-600 dark:text-gray-300"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {notification.title}
            </p>
            {!notification.isRead && (
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            )}
          </div>

          <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
            {notification.description}
          </p>

          {notification.response && (
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-xs text-success">
              <IconCircleCheck className="h-3 w-3" />
              {notification.response}
            </span>
          )}

          <div className="mt-1.5 flex items-center justify-between">
            <span
              className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] ${priority?.badge ?? "bg-gray-100 text-gray-500"}`}
            >
              {priority?.label ?? notification.priority}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
              <IconClock className="h-3 w-3" />
              {new Date(notification.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}
