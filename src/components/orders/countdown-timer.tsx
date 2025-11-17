"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  createdDatetime: string | Date;
  configuredMinutes: number; // tiempo configurado en minutos
}

// Cronómetro de cuenta regresiva basado en fecha de creación y minutos configurados
export function CountdownTimer({
  createdDatetime,
  configuredMinutes,
}: CountdownTimerProps) {
  const createdMs = new Date(createdDatetime).getTime();
  const targetMs = createdMs + configuredMinutes * 60 * 1000;
  const [remainingMs, setRemainingMs] = useState<number>(() =>
    Math.max(0, targetMs - Date.now())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMs(Math.max(0, targetMs - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  if (!configuredMinutes || configuredMinutes <= 0) return null;
  const formatRemaining = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  const totalMs = configuredMinutes * 60 * 1000;
  const progressPct = totalMs > 0 ? (remainingMs / totalMs) * 100 : 0;

  const countdownBadgeClass = () => {
    if (remainingMs <= 0)
      return "bg-green-100 text-green-700 border border-green-200";
    if (progressPct <= 30)
      return "bg-red-100 text-red-700 border border-red-200";
    if (progressPct <= 60)
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    return "bg-blue-100 text-blue-700 border border-blue-200";
  };

  return (
    <div className="mt-1 flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${countdownBadgeClass()}`}
      >
        <Clock className="h-3 w-3" />
        {remainingMs > 0
          ? `Falta: ${formatRemaining(remainingMs)}`
          : "Procesado"}
      </span>
      {remainingMs > 0 && (
        <div className="h-1 flex-1 bg-muted rounded overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${Math.max(0, 100 - progressPct)}%` }}
          />
        </div>
      )}
    </div>
  );
}
