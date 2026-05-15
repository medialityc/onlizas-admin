"use client";

import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import RHFAutocompleteFetcherInfinity from "./rhf-autcomplete-fetcher-scroll-infinity";
import { getSuppliersByCategories } from "@/services/categories";

interface RHFSuppliersByCategoryProps {
  name: string;
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  required?: boolean;
  categoryFieldName?: string;
}

/**
 * Reusable RHF autocomplete that fetches suppliers filtered by the selected
 * category IDs (GET /admin/categories/suppliers?categoryIds=...).
 *
 * Watches `categoryFieldName` (default: "categoryIds") from the form context
 * and passes them as query params to the endpoint. The field is disabled when
 * no categories are selected.
 */
export function RHFSuppliersByCategory({
  name,
  label = "Proveedores",
  placeholder = "Seleccionar proveedores...",
  multiple = true,
  required = false,
  categoryFieldName = "categoryIds",
}: RHFSuppliersByCategoryProps) {
  const categoryIds = useWatch({ name: categoryFieldName }) as
    | string[]
    | undefined;

  const hasCategories = Array.isArray(categoryIds) && categoryIds.length > 0;

  const extraFilters = useMemo(
    () => (hasCategories ? { categoryIds } : {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasCategories, JSON.stringify(categoryIds)],
  );

  return (
    <RHFAutocompleteFetcherInfinity
      name={name}
      label={label}
      placeholder={
        hasCategories ? placeholder : "Seleccione categorías primero..."
      }
      onFetch={getSuppliersByCategories}
      objectValueKey="id"
      objectKeyLabel="name"
      queryKey="suppliers-by-category"
      multiple={multiple}
      required={required}
      enabled={hasCategories}
      extraFilters={extraFilters}
    />
  );
}
