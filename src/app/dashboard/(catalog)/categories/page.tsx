import { buildQueryParams } from "@/lib/request";
import CategoriesListContainer from "@/sections/categories/list/categories-list-container";

import { getAllCategories } from "@/services/categories";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Gestión de Categorías - ZAS Express",
  description: "Administra las categorías del sistema y sus reglas específicas",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

function CategoriesListSkeleton() {
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

async function CategoriesListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const categoriesPromise = await getAllCategories(query);

  return (
    <Suspense fallback={<CategoriesListSkeleton />}>
      <CategoriesListContainer
        categoriesPromise={categoriesPromise}
        query={params}
      />
    </Suspense>
  );
}

export default CategoriesListPage;
