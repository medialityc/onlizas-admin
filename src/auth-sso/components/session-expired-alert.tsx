import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";

export const SessionExpiredAlert = ({
  type = "expired",
}: {
  type?: "error" | "expired";
}) => {
  const router = useRouter();
  const session = useAuth();
  useEffect(() => {
    console.log("[FIX-AUTH] SessionExpiredAlert mounted", session);
  }, [session]);
  const restartSession = () => {
    console.log("[FIX-AUTH] restartSession", session);
    session?.clearSession();
    router.push("/");

  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-white border border-blue-200 rounded-lg shadow-lg p-4 flex items-center justify-between animate-slide-down">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M12 20.5C6.75 20.5 2.5 16.25 2.5 11S6.75 1.5 12 1.5 21.5 5.75 21.5 11 17.25 20.5 12 20.5z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {type == "expired"
                ? "La sesión ha expirado"
                : "Error al obtener la sesión. Por favor, inicia sesión de nuevo."}
            </p>
            <p className="text-sm text-gray-600">
              Por favor, inicie sesión nuevamente.
            </p>
          </div>
        </div>
        {/* [FIX-AUTH]: Aqui redirijo a la ruta de inicio de sesion pero no manejo eliminar la sesion */}
        <button
          onClick={restartSession}
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded-md transition-colors"
        >
          Ir a Iniciar sesión
        </button>
      </div>
    </div>
  );
};
