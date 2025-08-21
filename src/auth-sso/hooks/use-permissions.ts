"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { COOKIE_PERMISSIONS_NAME } from "../lib/config";

// Hook ligero para obtener y reaccionar a cambios de permisos almacenados en la cookie 'prm'
// Devuelve: lista, set, helpers y función de refresco manual.
// No hace roundtrip al servidor: todo client-side.

const parsePermissionsCookie = (): string[] => {
  if (typeof document === "undefined") return [];
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(COOKIE_PERMISSIONS_NAME + "="))
    ?.split("=")[1];
  if (!raw) return [];
  return raw.split(".").filter(Boolean);
};

export interface UsePermissionsResult {
  list: string[]; // array ordenado alfabéticamente
  set: Set<string>; // acceso O(1)
  has: (perm: string) => boolean;
  hasEvery: (perms: string[]) => boolean;
  hasSome: (perms: string[]) => boolean;
  isLoaded: boolean; // indica que ya se parseó al menos una vez
  refresh: () => void; // fuerza re-lectura
}

export function usePermissions(
  autoRefreshIntervalMs = 0
): UsePermissionsResult {
  const [perms, setPerms] = useState<string[]>([]);
  const loadedRef = useRef(false);

  const refresh = useCallback(() => {
    const list = parsePermissionsCookie();
    list.sort();
    setPerms((prev) => {
      if (prev.length === list.length && prev.every((v, i) => v === list[i]))
        return prev; // evita rerender inútil
      return list;
    });
    loadedRef.current = true;
  }, []);

  // Primera carga
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Listener de foco para actualizar (evita stale permissions cuando cambian en otra pestaña)
  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  // Listener cross-tab (si se borra / cambia cookie vía logout en otra pestaña y se sincroniza localStorage)
  useEffect(() => {
    const key = "__perm_sync__";
    const handler = (e: StorageEvent) => {
      if (e.key === key) refresh();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [refresh]);

  // Intervalo opcional (solo si se pasa un valor > 0)
  useEffect(() => {
    if (!autoRefreshIntervalMs) return;
    const id = setInterval(refresh, autoRefreshIntervalMs);
    return () => clearInterval(id);
  }, [autoRefreshIntervalMs, refresh]);

  const setObj = useMemo(() => new Set(perms), [perms]);
  const has = useCallback((perm: string) => setObj.has(perm), [setObj]);
  const hasEvery = useCallback(
    (p: string[]) => p.every((x) => setObj.has(x)),
    [setObj]
  );
  const hasSome = useCallback(
    (p: string[]) => p.some((x) => setObj.has(x)),
    [setObj]
  );
  console.log("[PERM] hook", {
    list: perms,
    set: setObj,
    has,
    hasEvery,
    hasSome,
    isLoaded: loadedRef.current,
    refresh,
  });
  return {
    list: perms,
    set: setObj,
    has,
    hasEvery,
    hasSome,
    isLoaded: loadedRef.current,
    refresh,
  };
}

export default usePermissions;
