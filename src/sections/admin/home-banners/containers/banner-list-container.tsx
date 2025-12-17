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
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de banners
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
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
    </div>
  );
}
