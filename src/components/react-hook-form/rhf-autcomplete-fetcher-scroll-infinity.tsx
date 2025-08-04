import { useInfiniteAutocomplete } from "@/hooks/react-query/use-infinite-autocomplete";
import { PaginatedResponse } from "@/types/common";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { AutocompleteProps } from "@mantine/core";
import { useMemo } from "react";
import { AdvancedSearchSelect } from "../select/advance-form-select";

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
  queryKey='no-cache',
  enabled = true,
  ...other
}: Props<T>) {
  // Generate a stable query key based on name and params
  const stableQueryKey = useMemo(() => {
    return [queryKey,"infinite-autocomplete", JSON.stringify(params)];
  }, [queryKey, params]);

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteAutocomplete({
      queryKey: stableQueryKey,
      onFetch,
      params,
      enabled,
      ...cacheConfig,
    });

  // Flatten all pages data into a single array
  const options = useMemo(() => {
    console.log("DATAAAAAAA", data);
    return (
      data?.pages?.flatMap(
        (page: PaginatedResponse<T> | undefined) => page?.data ?? []
      ) ?? []
    );
  }, [data]);

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
      {...other}
    />
  );
}
