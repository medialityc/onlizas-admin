import { getCategoryById } from "@/services/categories";
import { notFound } from "next/navigation";
import CategoryEditFormContainer from "@/sections/categories/containers/category-edit-from.container";
import { CategoryFormData } from "@/sections/categories/schemas/category-schema";
import { Suspense } from "react";

export const metadata = {
  title: "Editar Categoría - ZAS Express",
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

interface EditPageProps {
  params: { id: string };
}

export default async function EditCategoryPage({ params }: EditPageProps) {
  const res = await getCategoryById(params.id);
  if (!res || res.error || !res.data) notFound();

  return (
    <Suspense fallback={<CategoryFallback />}>
      <CategoryEditFormContainer
        category={res.data! as unknown as CategoryFormData}
      />
    </Suspense>
  );
}
