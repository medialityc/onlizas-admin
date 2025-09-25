"use client";
import useFiltersUrl from "@/hooks/use-filters-url";
import React from "react";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllLocationLogsResponse } from "@/types/locations";
import { SearchParams } from "@/types/fetch/request";

import LocationLogsContent from "./locationlogs-list";

function LocationLogsContainer({
  locationLogsPromise,
  searchParams,
}: {
  searchParams: SearchParams;
  locationLogsPromise: ApiResponse<GetAllLocationLogsResponse>;
}) {
  const locationResponse = locationLogsPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };
  return (
    locationResponse.data && (
      <LocationLogsContent
        data={locationResponse.data}
        onSearchParamsChange={handleSearchParamsChange}
        searchParams={searchParams}
      />
    )
  );
}

export default LocationLogsContainer;
