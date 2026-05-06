"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetInventoryReviewsResponse } from "@/types/reviews";
import { ReviewsList } from "@/sections/reviews/list/reviews-list";

interface MyReviewsContainerProps {
  initialData: ApiResponse<GetInventoryReviewsResponse>;
  query: SearchParams;
}

export default function MyReviewsContainer({
  initialData,
  query,
}: MyReviewsContainerProps) {
  const { updateFiltersInUrl } = useFiltersUrl();

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Mis reseñas</h1>
          <p className="text-muted-foreground mt-1">
            Reseñas de clientes sobre tus productos
          </p>
        </div>
      </div>
      <ReviewsList
        data={initialData.data}
        searchParams={query}
        onSearchParamsChange={handleSearchParamsChange}
      />
    </div>
  );
}
