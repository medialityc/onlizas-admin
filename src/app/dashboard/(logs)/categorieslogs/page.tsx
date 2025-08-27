import { getAllCategoryLogs } from "@/services/logs/category";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";
import CategoriesLogsContainer from "@/sections/logs/categories/categorieslogs-container";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function CategoriesLogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const categoriesLogsPromise = await getAllCategoryLogs(query);
  return (
    <CategoriesLogsContainer
      categoriesLogsPromise={categoriesLogsPromise}
      searchParams={params}
    />
  );
}
