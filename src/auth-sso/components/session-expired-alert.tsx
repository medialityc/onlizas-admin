import lottie from "lottie-web";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useAuth } from "../hooks/use-auth";
import animationData from "./Error 401.json";

type Props = {
  type?: "error" | "expired";
  // You can pass your animated SVG here or as children
  animatedSvg?: React.ReactNode;
  // optional callback when the modal is closed (for parent control)
  onClose?: () => void;
};

export const SessionExpiredAlert: React.FC<Props> = ({
  type = "expired",
  onClose,
}) => {
  const router = useRouter();
  const session = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const instance = lottie.loadAnimation({
      container: containerRef.current!,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
    });

    return () => instance.destroy(); // Limpieza
  }, []);

  const restartSession = () => {
    session?.clearSession();
    // optional callback to inform parent
    onClose?.();
    // go to root / login
    router.push("/");
  };

  const title =
    type === "expired" ? "La sesión ha expirado" : "Error al obtener la sesión";

  return (
    // backdrop: full screen, slightly dark + blur
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg mx-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all duration-300 scale-100">
          <div className="p-6 md:p-8 flex flex-col items-center text-center gap-4">
            {/* Lottie animation (401) centered */}
            <div className="w-40 h-40 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 shadow-inner">
              <div
                ref={containerRef}
                className="w-72 h-72" // Tamaño del logo
              />
            </div>

            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              {title}
            </h3>

            <p className="text-sm text-gray-600 max-w-[26rem]">
              {type === "expired"
                ? "Tu sesión ha expirado por inactividad. Por seguridad, debes iniciar sesión de nuevo para continuar."
                : "Hubo un problema al recuperar tu sesión. Por favor, inicia sesión de nuevo para seguir."}
            </p>

            <div className="mt-4">
              <button
                onClick={restartSession}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-md shadow-md text-sm font-medium transition-colors"
              >
                Ir a Iniciar sesión
              </button>
            </div>
          </div>
        </div>
        {/* no close button: modal only closes via "Ir a Iniciar sesión" */}
      </div>
    </div>
  );
};
