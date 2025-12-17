import { UserDocumentsList } from "@/sections/users/documents/list/documents-list";
import { getUserDocuments } from "@/services/users";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "User Documents - Onlizas",
  description: "View documents for a specific user",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

function UserDocumentsSkeleton() {
  return (
    <div>
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

async function UserDocumentsPage({ params }: PageProps) {
  const { id } = await params;
  const documentsPromise = getUserDocuments(Number(id));

  return (
    <Suspense fallback={<UserDocumentsSkeleton />}>
      <UserDocumentsList
        documentsPromise={documentsPromise}
        userId={Number(id)}
      />
    </Suspense>
  );
}

export default UserDocumentsPage;
