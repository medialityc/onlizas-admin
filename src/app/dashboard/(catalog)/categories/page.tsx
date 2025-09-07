import { buildQueryParams } from "@/lib/request";
import CategoriesListContainer from "@/sections/categories/list/categories-list-container";

import { getAllCategories } from "@/services/categories";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

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

async function CategoriesListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const categoriesPromise = await getAllCategories(query);

  return (
    <CategoriesListContainer
      categoriesPromise={categoriesPromise}
      query={params}
    />
  );
}

export default CategoriesListPage;
