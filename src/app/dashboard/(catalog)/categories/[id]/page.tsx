import { getCategoryById } from "@/services/categories";
import { notFound } from "next/navigation";
import { CategoryFormData } from "@/sections/categories/schemas/category-schema";
import CategoryDetailsContainer from "@/sections/categories/containers/category-details-from.container";
import { Suspense } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Detalles Categoría - ZAS Express",
};

function CategoryFallback() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-start gap-6">
          <div className="w-48 h-48 bg-gray-200 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border p-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default async function CategoryDetailPage({ params }: Props) {
  const res = await getCategoryById((await params).id);
  if (!res || res.error || !res.data) notFound();

  return (
    <Suspense fallback={<CategoryFallback />}>
      <CategoryDetailsContainer
        category={res.data! as unknown as CategoryFormData}
      />
    </Suspense>
  );
}
