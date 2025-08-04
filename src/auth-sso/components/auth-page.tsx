"use client";

import { useSSOAuth } from "@/auth-sso/hooks/use-sso-auth.ts";
import { cn } from "@/lib/utils";
import {
  ArrowLeftOnRectangleIcon, // Reemplaza LogIn
  ArrowPathIcon,
  CheckCircleIcon, // Reemplaza CheckCircle
  ExclamationTriangleIcon, // Reemplaza AlertTriangle
} from "@heroicons/react/24/solid";
import { useState } from "react";

export function SSOLogin({ clientId }: { clientId: string }) {
  const { startSSO, error, status, isLoading, isSignedIn } = useSSOAuth({
    clientId,
  });
  const [isHovering, setIsHovering] = useState(false);

  if (isSignedIn || status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 transform transition-all duration-500 ease-in-out">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full blur-xl opacity-70"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <CheckCircleIcon
                className="w-10 h-10 text-green-600 animate-appear"
                strokeWidth={2}
              />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 animate-fadeIn">
            ¡Ha iniciado sesión correctamente!
          </h3>
          <p className="text-gray-600 animate-fadeIn delay-100">
            Redirigiendo a página principal...
          </p>
          <div className="mt-4 flex justify-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mx-1 animate-pulse"></span>
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mx-1 animate-pulse delay-100"></span>
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mx-1 animate-pulse delay-200"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 transform transition-all duration-500 ease-in-out">
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-70"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <ExclamationTriangleIcon
                className="w-10 h-10 text-red-600"
                strokeWidth={2}
              />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Ocurrió un error
          </h3>
          <p className="text-gray-600 mb-8 px-4">{error}</p>
          <button
            type="button"
            className={cn(
              "w-full relative overflow-hidden group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg",
              isLoading && "opacity-80 cursor-not-allowed"
            )}
            onClick={startSSO}
            disabled={isLoading}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center justify-center">
              {isLoading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                  Cargando...
                </>
              ) : (
                "Intentar de nuevo"
              )}
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Mostrar loading mientras verifica la sesión o durante el proceso de autenticación
  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 transform transition-all duration-500 ease-in-out">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-70"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <ArrowPathIcon
                className="w-10 h-10 text-blue-600 animate-spin"
                strokeWidth={2}
              />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
            {isLoading ? "Iniciando sesión" : "Verificando sesión"}
          </h3>
          <p className="text-gray-600 text-center">
            {isLoading
              ? "Verificando sus credenciales..."
              : "Comprobando si tiene una sesión activa..."}
          </p>
          <div className="mt-6 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 animate-progress rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Solo mostrar la ventana de inicio de sesión cuando esté confirmado que no hay sesión (unauthenticated)
  if (!isSignedIn || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 transform transition-all duration-500 ease-in-out hover:shadow-2xl">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-70"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <ArrowLeftOnRectangleIcon
                className={cn(
                  "w-10 h-10 text-blue-600 transition-transform duration-300",
                  isHovering && "translate-x-1"
                )}
                strokeWidth={2}
              />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
            Iniciar sesión
          </h3>
          <p className="text-gray-600 mb-8 text-center px-4">
            Presione el botón para iniciar sesión de forma segura con su cuenta
            corporativa.
          </p>
          <button
            type="button"
            className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            onClick={startSSO}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <span className="absolute inset-0 w-0 bg-white bg-opacity-20 group-hover:w-full transition-all duration-500 ease-out"></span>
            <span className="relative flex items-center justify-center">
              <ArrowPathIcon
                className={cn(
                  "w-5 h-5 mr-2 transition-transform duration-300",
                  isHovering && "translate-x-1"
                )}
              />
              Iniciar sesión
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Fallback: mostrar loading si el status no está definido
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 transform transition-all duration-500 ease-in-out">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-70"></div>
          <div className="relative w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
            <ArrowPathIcon
              className="w-10 h-10 text-blue-600 animate-spin"
              strokeWidth={2}
            />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
          Verificando sesión
        </h3>
        <p className="text-gray-600 text-center">
          Comprobando si tiene una sesión activa...
        </p>
        <div className="mt-6 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 animate-progress rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
