"use client"; // Error boundaries must be Client Components

import lottie from "lottie-web";
import { useEffect, useRef } from "react";
import animationData from "./Web Development.json";

export default function ErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Log error for observability
  useEffect(() => {
    console.error(error);
  }, [error]);

  // Init Lottie like session-expired-alert
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

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(90deg, #f8fafc 0%, #e0e7ef 100%)",
        padding: "2rem",
      }}
    >
      {/* Left: Lottie animation */}
      <div
        style={{
          flex: 1,
          maxWidth: 420,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={containerRef}
          style={{ width: "100%", maxWidth: 340, aspectRatio: "1 / 1" }}
        />
      </div>

      {/* Right: Content card */}
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
            background: "#eff6ff",
            color: "#1d4ed8",
            borderRadius: "999px",
            padding: ".35rem .75rem",
            fontSize: ".8rem",
            fontWeight: 600,
            marginBottom: ".75rem",
          }}
        >
          Aviso
        </span>
        <h2
          style={{
            color: "#1f2937",
            fontSize: "1.75rem",
            lineHeight: 1.2,
            fontWeight: 700,
            marginBottom: ".75rem",
          }}
        >
          ¡Ups! Algo salió mal
        </h2>
        <p
          style={{
            color: "#64748b",
            fontSize: "1.05rem",
            marginBottom: "1.75rem",
          }}
        >
          Ocurrió un error inesperado. Puedes intentar nuevamente y, si el
          problema persiste, contáctanos para ayudarte.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            style={{
              background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.75rem 1.25rem",
              fontSize: ".95rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(37,99,235,0.18)",
              transition: "transform .15s ease, box-shadow .2s ease",
            }}
            onMouseDown={(e) => (
              (e.currentTarget.style.transform = "translateY(1px)"),
              (e.currentTarget.style.boxShadow =
                "0 3px 10px rgba(37,99,235,0.18)")
            )}
            onMouseUp={(e) => (
              (e.currentTarget.style.transform = "translateY(0)"),
              (e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(37,99,235,0.18)")
            )}
          >
            Reintentar
          </button>
          <button
            onClick={() => (window?.location ? window.location.reload() : null)}
            style={{
              background: "#f1f5f9",
              color: "#0f172a",
              border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              padding: "0.75rem 1.1rem",
              fontSize: ".95rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Recargar página
          </button>
        </div>

        {error?.digest && (
          <small style={{ marginTop: "1rem", color: "#94a3b8" }}>
            Código de referencia: {error.digest}
          </small>
        )}
      </div>

      {/* Responsive adjustments */}
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
