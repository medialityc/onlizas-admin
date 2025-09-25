"use client";

import lottie from "lottie-web";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import animationData from "./animations/401.json";
// import removed unused clients / sso auth
import { useAuth } from "zas-sso-client";

import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

/**
 * Error401Fallback
 * Fallback especializado para errores 401 (sesión expirada / no autorizada).
 * Mantiene la misma interfaz (props) que el ErrorBoundary default (error, reset)
 * para ser un drop-in replacement cuando detectes un 401.
 */
export function Error401Fallback({
  error,
  reset,
}: {
  error?: Error & { digest?: string; status?: number };
  reset?: () => void;
}) {
  const router = useRouter();
  const { signOut } = useAuth();

  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Init Lottie
  useEffect(() => {
    if (!containerRef.current) return;
    const instance = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
    });
    return () => instance.destroy();
  }, []);

  const goBack = useCallback(() => {
    // Si existe reset (error boundary), úsalo primero; si no, intenta back
    if (reset) return reset();
    try {
      router.back();
    } catch {
      router.push("/");
    }
  }, [reset, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(90deg,#f8fafc 0%,#e2e8f0 100%)",
        padding: "2rem",
      }}
    >
      {/* Animación */}
      <div
        style={{
          flex: 1,
          maxWidth: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={containerRef}
          style={{ width: "100%", maxWidth: 300, aspectRatio: "1 / 1" }}
        />
      </div>

      {/* Contenido */}
      <div
        style={{
          flex: 2,
          maxWidth: 560,
          background: "#fff",
          borderRadius: "1.5rem",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          padding: "2.25rem 2rem",
          marginLeft: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          border: "1px solid #eef2f7",
        }}
      >
        <h2
          style={{
            color: "#1f2937",
            fontSize: "1.65rem",
            lineHeight: 1.2,
            fontWeight: 700,
            marginBottom: ".75rem",
          }}
        >
          Sesión expirada
        </h2>
        <p
          style={{
            color: "#64748b",
            fontSize: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          Tu sesión ya no es válida o no tienes autorización para acceder a este
          recurso. Inicia sesión nuevamente para continuar. Si el problema
          persiste, contacta a un administrador.
        </p>
        <div style={{ display: "flex", gap: ".75rem" }}>
          <button
            type="button"
            className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            onClick={() => signOut()}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <span className="absolute inset-0 w-0 bg-white bg-opacity-20 group-hover:w-full transition-all duration-500 ease-out"></span>
            <span className="relative flex items-center justify-center">
              <RefreshCw
                className={cn(
                  "w-5 h-5 mr-2 transition-transform duration-300",
                  isHovering && "translate-x-1"
                )}
              />
              Iniciar sesión
            </span>
          </button>
          <button
            onClick={goBack}
            style={{
              background: "#f1f5f9",
              color: "#0f172a",
              border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              padding: "0.75rem 1.1rem",
              fontSize: ".9rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Volver
          </button>
        </div>
        {error?.digest && (
          <small style={{ marginTop: "1rem", color: "#94a3b8" }}>
            Ref: {error.digest}
          </small>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*='display: flex'][style*='align-items: center'] {
            flex-direction: column;
            padding: 1rem;
          }
          div[style*='margin-left: 2rem'] {
            margin-left: 0 !important;
            margin-top: 1.5rem !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Error401Fallback;
