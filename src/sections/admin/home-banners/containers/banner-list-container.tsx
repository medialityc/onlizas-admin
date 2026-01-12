"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";

import { HomeBannerList } from "./banner-section-list";
import { IGetAllHomeBanner } from "@/types/home-banner";

interface Props {
  bannerPromise: ApiResponse<IGetAllHomeBanner>;
  query: SearchParams;
}

export default function HomeBannerListContainer({
  bannerPromise,
  query,
}: Props) {
  const bannerResponse = bannerPromise;
  const { updateFiltersInUrl } = useFiltersUrl();

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Gestión de banners
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra los banners de la tienda
          </p>
        </div>
      </div>
      <HomeBannerList
        data={bannerResponse.data}
        searchParams={query}
        onSearchParamsChange={handleSearchParamsChange}
      />
    </div>
  );
}
