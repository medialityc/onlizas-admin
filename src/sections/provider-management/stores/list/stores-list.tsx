"use client";

import { useCallback, useEffect } from "react";

import { GetAllStores, Store } from "@/types/stores";
import { SearchParams } from "@/types/fetch/request";
import { useModalState } from "@/hooks/use-modal-state";
import { useState } from "react";

import StoresModalContainer from "../modals/store-create-container";
import useFiltersUrl from "@/hooks/use-filters-url";
import { PAGE_SIZES } from "@/components/datagrid/constants";
import { useDataGridHandlers } from "@/components/datagrid/hooks";
import StoreListToolbar from "./components/toolbar";
import CardsGrid from "./components/cards-grid";
import Pagination from "./components/pagination";

interface StoresListProps {
  data?: GetAllStores;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function StoresList({
  data,
  searchParams,
  onSearchParamsChange,
}: StoresListProps) {
  const { getModalState, openModal, closeModal } = useModalState();

  const createStoreModal = getModalState("create");

  const handleCreateStore = useCallback(() => openModal("create"), [openModal]);

  const response = data;
  const items: Store[] = response?.data ?? [];

  const totalStores = response?.totalCount;

  const [searchValue, setSearchValue] = useState(searchParams.search || "");

  const { updateFiltersInUrl } = useFiltersUrl();

  const mergedOnSearchParamsChange = useCallback(
    (params: SearchParams) => {
      onSearchParamsChange?.(params);
      updateFiltersInUrl(params);
    },
    [onSearchParamsChange, updateFiltersInUrl]
  );

  const { handlePageChange, handlePageSizeChange } = useDataGridHandlers({
    searchParams,
    onSearchParamsChange: mergedOnSearchParamsChange,
  });

  useEffect(() => {
    mergedOnSearchParamsChange({
      ...searchParams,
      search: searchValue.trim(),
      page: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const page = searchParams.page ?? 1;
  const pageSize = searchParams.pageSize ?? PAGE_SIZES[0];
  const totalRecords = totalStores ?? 0;

  const shouldSliceClientSide = totalRecords <= items.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, items.length);
  const visibleItems = shouldSliceClientSide
    ? items.slice(startIndex, endIndex)
    : items;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <StoreListToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onCreate={handleCreateStore}
      />

      {/* <MetricsGrid totalStores={totalStores ?? 0} totalVisits={0} /> */}

      <CardsGrid items={visibleItems} />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Modal de creación de tienda */}
      <StoresModalContainer
        open={createStoreModal.open}
        onClose={() => closeModal("create")}
      />
    </div>
  );
}
