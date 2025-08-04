import { ApiResponse } from "@/types/fetch/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useRef } from "react";


export const useFetchError = (response: ApiResponse<any>) => {
  const router = useRouter();
  const lastStatusRef = useRef<number | null>(null);

  useEffect(() => {
    if (!response.error || lastStatusRef.current === response.status) return;

    let message = "";

   if (response.status === 403) {
      message =
        "No tienes permisos para acceder a esta sección. Por favor, contacta al administrador del sistema.";
    } else if (response.status === 404) {
      message = "No se encontraron datos para mostrar.";
    } else if (response.status >= 500) {
      message = "Error del servidor. Por favor, intenta más tarde.";
    }

    if (message) {
      toast.error(message);
      lastStatusRef.current = response.status; // Memoriza el status mostrado
    }
  }, [response, router]);
};
