"use client";
import debounce from "@/services/utils/debounce";
import { SearchParams } from "@/types/fetch/request";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export default function useFiltersUrl() {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const debouncedUpdateFiltersInUrl = useMemo(
    () =>
      debounce((updatedFilters: SearchParams) => {
        const searchUrl = new URLSearchParams(searchParams);

        Object.entries(updatedFilters).forEach(([key, value]) => {
          if (value === undefined || value === null || value === "") {
            searchUrl.delete(key);
          } else if (typeof value === "number") {
            searchUrl.set(key, value.toString());
          } else if (typeof value === "boolean") {
            searchUrl.set(key, value ? "true" : "false");
          } else if (Array.isArray(value)) {
            searchUrl.delete(key); // Borra valores previos
            value.forEach(val => searchUrl.append(key, val.toString()));
          } else {
            searchUrl.set(key, value.toString());
          }
        });
        replace(`${pathname}?${searchUrl.toString()}`, { scroll: false });
      }, 300),
    [searchParams, pathname, replace]
  );

  const updateFiltersInUrl = useCallback(
    (updatedFilters: SearchParams) => {
      debouncedUpdateFiltersInUrl(updatedFilters);
    },
    [debouncedUpdateFiltersInUrl]
  );

  return { updateFiltersInUrl };
}
