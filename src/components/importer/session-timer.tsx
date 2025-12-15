"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { logoutImporter } from "@/services/importer-access";
import showToast from "@/config/toast/toastConfig";
import { Badge } from "@mantine/core";
import IconClock from "@/components/icon/icon-clock";

interface Props {
  expiresAt: number;
}

export default function SessionTimer({ expiresAt }: Props) {
  const router = useRouter();
  const params = useParams();
  const importerId = params?.id as string;
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const remaining = expiresAt - now;
      return Math.max(0, Math.floor(remaining / 1000));
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        handleSessionExpired();
      } else if (remaining === 300) {
        showToast("Su sesión expirará en 5 minutos", "warning");
      } else if (remaining === 60) {
        showToast("Su sesión expirará en 1 minuto", "warning");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleSessionExpired = async () => {
    await logoutImporter();
    showToast("Su sesión ha expirado", "error");
    const redirectPath = importerId ? `/importadora/${importerId}` : "/importadora/login";
    router.push(redirectPath);
    router.refresh();
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getBadgeColor = (): string => {
    if (timeLeft > 600) return "green";
    if (timeLeft > 300) return "yellow";
    return "red";
  };

  const getBadgeVariant = () => {
    if (timeLeft <= 300) return "filled";
    return "light";
  };

  return (
    <Badge
      size="lg"
      color={getBadgeColor()}
      variant={getBadgeVariant()}
      leftSection={<IconClock className="w-4 h-4" />}
      className="font-mono"
    >
      Sesión: {formatTime(timeLeft)}
    </Badge>
  );
}
