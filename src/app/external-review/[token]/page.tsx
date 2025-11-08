export const dynamic = "force-dynamic"; // Evita caché estática del build y expone token solo en runtime
export const revalidate = 0;

import { Suspense } from "react";
import { notFound } from "next/navigation";
import ExternalReviewClient from "../../../sections/suppliers/edit/external-review/ExternalReviewClient";
import { getExternalReviewApprovalProcess } from "@/services/external-review";

interface PageProps {
  params: Promise<{ token: string }>;
}

function isTokenFormatValid(token: string) {
  // Ajustar según políticas reales del backend (longitud, caracteres, etc.)
  return /^[A-Za-z0-9_-]{16,}$/.test(token);
}

export default async function ExternalReviewPage({ params }: PageProps) {
  const { token } = await params;
  const { data } = await getExternalReviewApprovalProcess(token);

  if (!isTokenFormatValid(token)) {
    // Evitar filtrar información; token mal formado => 404 genérico
    notFound();
  }

  // No hacemos fetch en el server component para no serializar el token en HTML y evitar caching.
  return (
    <Suspense
      fallback={
        <div className="p-6" role="status" aria-busy>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="h-6 w-2/3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>
      }
    >
      {data && <ExternalReviewClient token={token} data={data} />}
    </Suspense>
  );
}
