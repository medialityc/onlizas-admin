"use client";

import { useState } from "react";
import { useNotifications } from "../hooks/use-notifications";
import type { AppNotification } from "../types/notification.types";
import IconClock from "@/components/icon/icon-clock";
import IconInfoCircle from "@/components/icon/icon-info-circle";

interface Props {
  notification: AppNotification;
}

const PRIORITY_BAR: Record<string, string> = {
  Low: "bg-success",
  Medium: "bg-warning",
  High: "bg-danger",
  Critical: "bg-danger animate-pulse",
};

export function NotificationQuestion({ notification }: Props) {
  const { respond, loadingIds } = useNotifications();
  const [answered, setAnswered] = useState<string | null>(null);
  const isLoading = loadingIds.has(notification.notificationId);

  let options: string[] = [];
  try {
    if (notification.options) {
      options = JSON.parse(notification.options) as string[];
    }
  } catch {
    options = [];
  }

  const handleRespond = async (option: string) => {
    await respond(notification.notificationId, option);
    setAnswered(option);
  };

  return (
    <li key={notification.notificationId} onClick={(e) => e.stopPropagation()}>
      <div className="relative flex gap-3 bg-primary/5 px-4 py-3.5 dark:bg-primary/10">
        {/* Left priority bar */}
        <span
          className={`absolute inset-y-0 left-0 w-0.5 rounded-full ${PRIORITY_BAR[notification.priority] ?? "bg-gray-300"}`}
        />

        {/* Icon */}
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
          <IconInfoCircle className="h-4 w-4 text-primary" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {notification.title}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
            {notification.description}
          </p>

          {notification.questionText && (
            <p className="mt-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200">
              {notification.questionText}
            </p>
          )}

          {options.length > 0 && !answered && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleRespond(opt)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-white px-3 py-1 text-xs font-medium text-primary shadow-sm transition-all hover:border-primary hover:bg-primary hover:text-white hover:shadow disabled:cursor-wait disabled:opacity-50 dark:bg-transparent dark:hover:bg-primary"
                >
                  {isLoading && (
                    <svg
                      className="h-3 w-3 animate-spin"
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
                  )}
                  {opt}
                </button>
              ))}
            </div>
          )}

          {answered && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Respondido: {answered}
            </span>
          )}

          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
            <IconClock className="h-3 w-3" />
            {new Date(notification.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </li>
  );
}
