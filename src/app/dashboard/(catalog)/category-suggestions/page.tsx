import { buildQueryParams } from "@/lib/request";
import CategorySuggestionsServerWrapper from "@/sections/category-suggestions/containers/category-suggestions-server-wrapper";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sugerencias de Categorías - Onlizas",
  description: "Gestiona las sugerencias de nuevas categorías",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function CategorySuggestionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);

  return <CategorySuggestionsServerWrapper query={params} />;
}

export default CategorySuggestionsPage;
