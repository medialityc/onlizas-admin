"use client";

import { useRef, useCallback, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserNotifications } from "@/services/notifications";
import { useNotifications } from "../hooks/use-notifications";
import { NotificationItem } from "../components/notification-item";
import { NotificationQuestion } from "../components/notification-question";
import { NotificationEmpty } from "../components/notification-empty";
import IconBellBing from "@/components/icon/icon-bell-bing";

const PAGE_SIZE = 20;

type TabFilter = "all" | "unread";

export function NotificationsFullList() {
  const { unreadCount } = useNotifications();
  const [tab, setTab] = useState<TabFilter>("all");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["notifications", "full-list", tab],
      queryFn: async ({ pageParam = 1 }) => {
        const result = await getUserNotifications({
          pagination: { page: pageParam, pageSize: PAGE_SIZE },
          sortBy: "createdDatetime",
          isDescending: true,
          ...(tab === "unread" ? { unreadOnly: true } : {}),
        });
        return result.data;
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage || !lastPage.hasNext) return undefined;
        return lastPage.page + 1;
      },
      initialPageParam: 1,
    });

  const lastElementRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  const allNotifications =
    data?.pages.flatMap((page) => page?.data ?? []) ?? [];

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Notificaciones
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {totalCount} notificaciones en total
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
                {unreadCount} sin leer
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-white/5">
        <button
          type="button"
          onClick={() => setTab("all")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "all"
              ? "bg-white text-primary shadow-sm dark:bg-dark"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          Todas
        </button>
        <button
          type="button"
          onClick={() => setTab("unread")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "unread"
              ? "bg-white text-primary shadow-sm dark:bg-dark"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          No leídas
          {unreadCount > 0 && (
            <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5"
            />
          ))}
        </div>
      ) : allNotifications.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
              <IconBellBing className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Todo al día
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {tab === "unread"
                ? "No tienes notificaciones sin leer"
                : "No tienes notificaciones pendientes"}
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {allNotifications.map((notif, index) => {
            const isLast = index === allNotifications.length - 1;
            const mapped = {
              notificationId: notif.id,
              createdAt: notif.createdDatetime,
              description: notif.description,
              isRead: notif.isRead,
              notificationType: notif.notificationType,
              options: notif.options,
              title: notif.title,
              priority: notif.priority,
              userId: notif.userId,
              questionText: notif.questionText,
              originSystemId: notif.originSystemId,
              response: notif.response,
              respondedAt: notif.respondedAt,
              respondedInSystem: notif.respondedInSystem,
              readAt: notif.readAt,
              callbackUrl: notif.callbackUrl,
              metadata: notif.metadata,
            };

            const content =
              notif.notificationType === "Question" && !notif.response ? (
                <NotificationQuestion notification={mapped} />
              ) : (
                <NotificationItem notification={mapped} />
              );

            return (
              <li
                key={notif.id}
                ref={isLast ? lastElementRef : undefined}
                className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/10"
              >
                {content}
              </li>
            );
          })}

          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <svg
                className="h-6 w-6 animate-spin text-primary"
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
            </div>
          )}
        </ul>
      )}
    </div>
  );
}
