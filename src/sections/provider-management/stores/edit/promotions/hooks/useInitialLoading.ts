import { useState, useEffect } from "react";

/**
 * Hook para manejar estados de carga inicial
 * Evita mostrar loading completo en refetches posteriores
 */
export function useInitialLoading(isLoading: boolean) {
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    if (!isLoading && !hasLoadedOnce) {
      setHasLoadedOnce(true);
    }
  }, [isLoading, hasLoadedOnce]);

  const isInitialLoad = isLoading && !hasLoadedOnce;
  const isRefetching = isLoading && hasLoadedOnce;

  return {
    isInitialLoad,
    isRefetching,
    hasLoadedOnce,
  };
}
