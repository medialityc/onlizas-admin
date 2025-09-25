"use client";
import ErrorFallback from "@/components/error/general-error";
import Error401Fallback from "@/components/error/error-401";
import Error403Fallback from "@/components/error/error-403";

type AnyError = Error & {
  digest?: string;
  status?: number;
  code?: number | string;
  cause?: any;
};

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: AnyError;
  reset: () => void;
}) {
  // Extraemos status y message de distintas fuentes potenciales
  const status =
    (error as any)?.status ||
    (error as any)?.code ||
    (error as any)?.cause?.status ||
    (error as any)?.cause?.code;

  const message = error?.message || (error as any)?.cause?.message;

  // Log discreto para debugging (no visible al usuario)
  // Estructurado para facilitar observabilidad
  console.error("[Dashboard ErrorBoundary]", {
    status,
    message,
    digest: error?.digest,
    full: error,
  });

  if (status === 401) {
    return <Error401Fallback error={error} reset={reset} />;
  }
  if (status === 403) {
    return <Error403Fallback error={error} reset={reset} />;
  }

  return <ErrorFallback error={error} reset={reset} />;
}
