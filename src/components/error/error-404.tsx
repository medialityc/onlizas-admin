"use client";

import lottie from "lottie-web";
import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import animationData from "./animations/404.json";
import { paths } from "@/config/paths";

/**
 * Error404Fallback
 * Pantalla especializada para status 404 (not found / no encontrado).
 * Mensaje: página no encontrada. Botón: Ir a página de inicio.
 */
export function Error404Fallback({
  error,
  reset,
}: {
  error?: Error & { digest?: string; status?: number };
  reset?: () => void;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (error) console.warn("404 Fallback error captured", error);
  }, [error]);

  const goHome = useCallback(() => {
    // Preferimos reset si proviene de un boundary para limpiar estado
    if (reset) reset();
    router.push(paths.dashboard.root);
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
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".5rem",
            background: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "999px",
            padding: ".35rem .75rem",
            fontSize: ".7rem",
            fontWeight: 600,
            marginBottom: ".75rem",
            letterSpacing: ".5px",
            textTransform: "uppercase",
          }}
        >
          No encontrado (404)
        </span>
        <h2
          style={{
            color: "#1f2937",
            fontSize: "1.65rem",
            lineHeight: 1.2,
            fontWeight: 700,
            marginBottom: ".75rem",
          }}
        >
          Página no encontrada
        </h2>
        <p
          style={{
            color: "#64748b",
            fontSize: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          La página que intentas acceder no existe o fue movida. Verifica la URL
          o vuelve a la página de inicio.
        </p>
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <button
            onClick={goHome}
            style={{
              background: "linear-gradient(90deg,#dc2626 0%,#f87171 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.75rem 1.25rem",
              fontSize: ".9rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(220,38,38,0.25)",
            }}
          >
            Ir a página de inicio
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

export default Error404Fallback;
