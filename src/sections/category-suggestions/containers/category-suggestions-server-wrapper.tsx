import { SearchParams, IQueryable } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";
import { getModulePermissions } from "@/components/permission/server-permission-wrapper";
import {
  getAllCategorySuggestions,
  getMyCategorySuggestions,
} from "@/services/category-suggestions";
import CategorySuggestionsAdminContainer from "./category-suggestions-admin-container";
import CategorySuggestionsSupplierContainer from "./category-suggestions-supplier-container";

interface Props {
  query: SearchParams;
}

export default async function CategorySuggestionsServerWrapper({ query }: Props) {
  const { isAdmin, isSupplier } = await getModulePermissions("categorySuggestions");

  const apiQuery: IQueryable = buildQueryParams(
    query as Record<string, unknown>,
  );

  if (isAdmin) {
    const suggestionsResponse = await getAllCategorySuggestions(apiQuery);

    return (
      <CategorySuggestionsAdminContainer
        suggestionsPromise={suggestionsResponse}
        query={query}
      />
    );
  }

  if (isSupplier) {
    const suggestionsResponse = await getMyCategorySuggestions(apiQuery);

    return (
      <CategorySuggestionsSupplierContainer
        suggestionsPromise={suggestionsResponse}
        query={query}
      />
    );
  }

  return (
    <div className="panel p-6">
      <h2 className="text-lg font-semibold mb-2">
        Sugerencias de categorías
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No tiene permisos para visualizar sugerencias de categorías.
      </p>
    </div>
  );
}
