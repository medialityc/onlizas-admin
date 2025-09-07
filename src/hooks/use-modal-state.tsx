// hooks/use-modal-state.ts
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useRef } from "react";

type ModalState<T = string> = {
  open: boolean;
  id?: T;
};

export function useModalState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado local para respuesta inmediata
  const [localState, setLocalState] = useState<
    Record<string, string | undefined>
  >({});

  // Ref para evitar loops infinitos
  const isUpdatingFromURL = useRef(false);

  // Inicializar estado local desde URL solo una vez
  useEffect(() => {
    if (isUpdatingFromURL.current) return;

    const urlState: Record<string, string | undefined> = {};
    searchParams.forEach((value, key) => {
      urlState[key] = value;
    });

    setLocalState(urlState);
  }, []); // Solo en mount

  // Sincronizar cuando cambia la URL externamente (back/forward)
  useEffect(() => {
    if (isUpdatingFromURL.current) {
      isUpdatingFromURL.current = false;
      return;
    }

    const urlState: Record<string, string | undefined> = {};
    searchParams.forEach((value, key) => {
      urlState[key] = value;
    });

    setLocalState(urlState);
  }, [searchParams]);

  const getModalState = useCallback(
    <T = string,>(key: string): ModalState<T> => {
      const value = localState[key];
      return {
        open: !!value,
        id: value && value !== "true" ? (value as T) : undefined,
      };
    },
    [localState]
  );

  const openModal = useCallback(
    <T = string,>(key: string, id?: T) => {
      const value = id?.toString() ?? "true";

      // Actualizar estado local inmediatamente
      setLocalState((prev) => ({ ...prev, [key]: value }));

      // Actualizar URL de forma asíncrona
      isUpdatingFromURL.current = true;
      const params = new URLSearchParams(searchParams);
      params.set(key, value);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const closeModal = useCallback(
    (...keys: string[]) => {
      // Actualizar estado local inmediatamente
      setLocalState((prev) => {
        const newState = { ...prev };
        keys.forEach((key) => delete newState[key]);
        return newState;
      });

      // Actualizar URL de forma asíncrona
      isUpdatingFromURL.current = true;
      const params = new URLSearchParams(searchParams);
      keys.forEach((key) => params.delete(key));
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const closeAllModals = useCallback(
    (keepParams: string[] = []) => {
      // Actualizar estado local inmediatamente
      setLocalState((prev) => {
        const newState: Record<string, string | undefined> = {};
        keepParams.forEach((key) => {
          if (prev[key] !== undefined) {
            newState[key] = prev[key];
          }
        });
        return newState;
      });

      // Actualizar URL de forma asíncrona
      isUpdatingFromURL.current = true;
      const params = new URLSearchParams();

      // Mantener solo los parámetros especificados
      keepParams.forEach((key) => {
        const value = searchParams.get(key);
        if (value) params.set(key, value);
      });

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Función para verificar si algún modal está abierto
  const hasOpenModals = useCallback(() => {
    return Object.values(localState).some((value) => !!value);
  }, [localState]);

  return {
    getModalState,
    openModal,
    closeModal,
    closeAllModals,
    hasOpenModals,
  };
}
