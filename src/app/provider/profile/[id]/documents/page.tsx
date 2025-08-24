import { ProviderDocumentsList } from "@/sections/provider-management/profile/documents/list/provider-documents-list";
import { getUserDocuments } from "@/services/users";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Mis Documentos - ZAS Express",
  description: "Gestiona tus documentos del perfil",
};
interface Props {
  params: Promise<{ id: string }>;
}

function UserDocumentsSkeleton() {
  return (
    <div className="panel">
      <div className="mb-5">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="flex gap-4 mb-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-64"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
      </div>
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

async function ProfileDocumentsPage({ params }: Props) {
  // Para el perfil del usuario actual, usamos un ID fijo o el del contexto de sesión
  // TODO: Obtener el ID del usuario desde el contexto de sesión
  /*     const { id } = await params;
    const documentsPromise = getUserDocuments(Number(id)); */
  const userId = 123; // Por ahora usamos el mock user ID

  const documentsPromise = getUserDocuments(userId);

  return (
    <Suspense fallback={<UserDocumentsSkeleton />}>
      <ProviderDocumentsList
        documentsPromise={documentsPromise}
        userId={userId}
      />
    </Suspense>
  );
}

export default ProfileDocumentsPage;
