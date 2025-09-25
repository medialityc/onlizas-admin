"use client";
import Error403Fallback from "@/components/error/error-403";

type AnyError = Error & {
  digest?: string;
  status?: number;
  code?: number | string;
  cause?: any;
};

export default function ErrorBoundaryForbidden({
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

  return <Error403Fallback error={error} reset={reset} />;
}
