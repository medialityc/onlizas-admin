import { NextResponse } from "next/server";

// Rate limiting simple en memoria (no apto para multi instancia, pero suficiente para protección básica)
const WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const MAX_REQUESTS = 50; // Máximo por IP por ventana

interface Counter {
  count: number;
  expires: number;
}

const ipCounters = new Map<string, Counter>();

export function rateLimit(ip: string | undefined) {
  if (!ip) return { allowed: true };
  const now = Date.now();
  const existing = ipCounters.get(ip);
  if (!existing || existing.expires < now) {
    ipCounters.set(ip, { count: 1, expires: now + WINDOW_MS });
    return { allowed: true };
  }
  existing.count += 1;
  if (existing.count > MAX_REQUESTS) {
    return {
      allowed: false,
      response: new NextResponse(null, { status: 429 }),
    };
  }
  return { allowed: true };
}

export function getClientIp(headers: Headers) {
  // Encabezados comunes detrás de proxies
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "direct"
  );
}

// Sanitiza salida para evitar campos sensibles
export function sanitizeReviewPayload<T extends Record<string, any>>(data: T) {
  if (!data || typeof data !== "object") return data;
  const clone: Record<string, any> = { ...data };
  // Ejemplo: remover internalNotes si existiera
  if ("internalNotes" in clone) delete clone.internalNotes;
  return clone as T;
}
