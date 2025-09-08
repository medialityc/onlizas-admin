import { ApiResponse } from "@/types/fetch/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";

export const useFetchError = (response: ApiResponse<any>) => {
  const router = useRouter();
  const lastStatusRef = useRef<number | null>(null);
  const [errorState, setErrorState] = useState<{
    hasError: boolean;
    status: number | null;
    message: string;
  }>({
    hasError: false,
    status: null,
    message: "",
  });

  useEffect(() => {
    if (!response.error || lastStatusRef.current === response.status) return;

    let message = "";

    switch (response.status) {
      case 401:
        message = "Sesión expirada. Por favor, inicia sesión nuevamente.";
        break;
      case 403:
        message =
          "No tienes permisos para acceder a esta sección. Contacta al administrador.";
        break;
      case 404:
        message = "No se encontraron datos para mostrar.";
        break;
      default:
        if (response.status >= 500) {
          message = "Error del servidor. Por favor, intenta más tarde.";
        }
        break;
    }

    if (message) {
      toast.error(message);
      lastStatusRef.current = response.status;
      setErrorState({
        hasError: true,
        status: response.status,
        message,
      });
    }
  }, [response, router]);

  return errorState;
};
