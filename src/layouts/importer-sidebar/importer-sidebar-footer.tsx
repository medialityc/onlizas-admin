"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Badge, Progress, Text, Tooltip, ActionIcon } from "@mantine/core";
import { ClockIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { logoutImporter } from "@/services/importer-access";

interface ImporterSidebarFooterProps {
  importerId: string;
  importerName?: string;
  expiresAt?: number;
}

const ImporterSidebarFooter = ({
  importerId,
  importerName,
  expiresAt,
}: ImporterSidebarFooterProps) => {
  const router = useRouter();
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [progress, setProgress] = useState<number>(100);

  const SESSION_DURATION = 60 * 60 * 1000; // 1 hour in ms

  const formatTime = useCallback((ms: number): string => {
    if (ms <= 0) return "00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = expiresAt - now;
      
      if (remaining <= 0) {
        setRemainingTime(0);
        setProgress(0);
        handleLogout();
        return;
      }

      setRemainingTime(remaining);
      setProgress((remaining / SESSION_DURATION) * 100);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleLogout = async () => {
    await logoutImporter();
    router.push(`/importadora/${importerId}`);
    router.refresh();
  };

  const getTimeColor = (): string => {
    if (progress > 50) return "teal";
    if (progress > 25) return "yellow";
    return "red";
  };

  return (
    <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
            <Text size="xs" c="dimmed">
              Sesión expira en
            </Text>
          </div>
          <Badge size="sm" color={getTimeColor()} variant="light">
            {formatTime(remainingTime)}
          </Badge>
        </div>
        <Progress
          value={progress}
          size="xs"
          color={getTimeColor()}
          className="mb-2"
        />
      </div>

      <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm shrink-0">
            {importerName?.charAt(0).toUpperCase() || "I"}
          </div>
          <div className="min-w-0">
            <Text size="sm" fw={500} truncate className="text-gray-900 dark:text-gray-100">
              {importerName || "Importadora"}
            </Text>
            <Text size="xs" c="dimmed">
              Sesión activa
            </Text>
          </div>
        </div>
        
        <Tooltip label="Cerrar sesión" position="top">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
          >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
          </ActionIcon>
        </Tooltip>
      </div>
    </div>
  );
};

export default ImporterSidebarFooter;
