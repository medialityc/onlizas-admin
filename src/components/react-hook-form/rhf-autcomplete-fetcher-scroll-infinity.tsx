import { useInfiniteAutocomplete } from "@/hooks/react-query/use-infinite-autocomplete";
import { PaginatedResponse } from "@/types/common";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { AutocompleteProps } from "@mantine/core";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdvancedSearchSelect } from "../select/advance-form-select";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const handler = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (handler.current) clearTimeout(handler.current);
    handler.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (handler.current) clearTimeout(handler.current);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface Props<T> extends Omit<AutocompleteProps, "data" | "renderOption"> {
  name: string;
  label?: string;
  placeholder?: string;
  exclude?: string[];
  required?: boolean;
  multiple?: boolean;
  dataTest?: string;
  onChangeOptional?: VoidFunction;
  onScrollEnd?: VoidFunction;
  renderOption?: (option: T) => React.ReactNode;
  renderMultiplesValues?: (
    options: T[],
    removeSelected: (option: T) => void
  ) => React.ReactNode;
  onFetch: (params: IQueryable) => Promise<ApiResponse<PaginatedResponse<T>>>;
  objectValueKey?: keyof T;
  objectKeyLabel?: keyof T;
  params?: IQueryable;
  containerClassname?: string;
  pillsClassname?: string;
  queryKey?: string;
  enabled?: boolean;
  inputClassName?: string;
}

export default function RHFAutocompleteFetcherInfinity<T>({
  name,
  label,
  placeholder,
  required = false,
  onFetch,
  onChangeOptional,
  exclude,
  objectValueKey = "id" as keyof T,
  objectKeyLabel = "name" as keyof T,
  params = { pageSize: 35 },
  pillsClassname,
  renderMultiplesValues,
  multiple = false,
  queryKey = "no-cache",
  enabled = true,
  inputClassName,
  ...other
}: Props<T>) {
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 350);

  // Genera la queryKey estable basada en nombre, params y búsqueda
  const stableQueryKey = useMemo(() => {
    return [
      queryKey,
      "infinite-autocomplete",
      JSON.stringify(params),
      debouncedSearchTerm,
    ];
  }, [queryKey, params, debouncedSearchTerm]);

  const cacheConfig = useMemo(() => {
    if (queryKey === "no-cache") {
      return {
        staleTime: 0,
        cacheTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
      };
    }
    return {};
  }, [queryKey]);

  // Actualiza el parámetro de búsqueda en onFetch
  const fetcherWithSearch = useCallback(
    (fetchParams: IQueryable) => {
      return onFetch({ ...fetchParams, search: debouncedSearchTerm });
    },
    [onFetch, debouncedSearchTerm]
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteAutocomplete({
      queryKey: stableQueryKey,
      onFetch: fetcherWithSearch,
      params,
      enabled,
      ...cacheConfig,
    });

  // Unifica los datos en un array y filtra por exclude
  const options = useMemo(() => {
    console.log("Data from useInfiniteAutocomplete:", data);

    const allOptions =
      data?.pages?.flatMap(
        (page: PaginatedResponse<T> | undefined) => page?.data ?? []
      ) ?? [];

    if (!exclude || exclude.length === 0) {
      return allOptions;
    }

    return allOptions.filter(
      (option) => !exclude.includes(String(option[objectValueKey]))
    );
  }, [data, exclude, objectValueKey]);

  const handleScrollEnd = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <AdvancedSearchSelect
      name={name}
      label={label}
      placeholder={placeholder}
      required={required}
      options={options}
      loading={isLoading || isFetchingNextPage}
      objectValueKey={objectValueKey}
      onScrollEnd={handleScrollEnd}
      onChangeOptional={onChangeOptional}
      exclude={exclude}
      objectKeyLabel={objectKeyLabel}
      multiple={multiple}
      pillsClassname={pillsClassname}
      renderMultiplesValues={renderMultiplesValues}
      query={searchTerm}
      inputClassName={inputClassName}
      setQuery={setSearchTerm}
      {...other}
    />
  );
}
