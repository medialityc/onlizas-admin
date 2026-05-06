"use client";

import { useMemo, useState, useCallback } from "react";
import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllCategorySuggestions, CategorySuggestion } from "@/types/category-suggestions";
import { DataGrid } from "@/components/datagrid/datagrid";
import type { DataTableColumn } from "mantine-datatable";
import Badge from "@/components/badge/badge";
import { CategorySuggestionState } from "../constants/suggestion-state";
import CreateSuggestionModal from "../modals/create-suggestion-modal";
import { useModalState } from "@/hooks/use-modal-state";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { usePermissions } from "@/hooks/use-permissions";

interface Props {
  suggestionsPromise: ApiResponse<GetAllCategorySuggestions>;
  query: SearchParams;
}

export default function CategorySuggestionsSupplierContainer({
  suggestionsPromise,
  query,
}: Props) {
  const { updateFiltersInUrl } = useFiltersUrl();
  const { getModalState, openModal, closeModal } = useModalState();
  const { hasPermission } = usePermissions();

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  const handleCreate = useCallback(() => {
    openModal("create-suggestion");
  }, [openModal]);

  const stateVariantMap: Record<
    CategorySuggestionState,
    { variant: Parameters<typeof Badge>[0]["variant"]; label: string }
  > = {
    [CategorySuggestionState.PENDING]: {
      variant: "outline-warning",
      label: "Pendiente",
    },
    [CategorySuggestionState.APPROVED]: {
      variant: "outline-success",
      label: "Aprobada",
    },
    [CategorySuggestionState.REJECTED]: {
      variant: "outline-danger",
      label: "Rechazada",
    },
  };

  const columns: DataTableColumn<CategorySuggestion>[] = useMemo(
    () => [
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (s) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {s.name}
          </span>
        ),
      },
      {
        accessor: "state",
        title: "Estado",
        sortable: true,
        render: (s) => {
          const info = stateVariantMap[s.state];
          return (
            <Badge variant={info.variant} rounded>
              {info.label}
            </Badge>
          );
        },
      },
      {
        accessor: "createdDatetime",
        title: "Fecha de creación",
        sortable: true,
        render: (s) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {s.createdDatetime
              ? new Date(s.createdDatetime).toLocaleDateString()
              : "-"}
          </span>
        ),
      },
    ],
    [],
  );

  const createModalState = getModalState("create-suggestion");

  return (
    <div className="space-y-6">
      <div className="panel flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Mis sugerencias de categorías
            </h1>
            <p className="text-muted-foreground mt-1">
              Visualiza el estado de tus sugerencias de nuevas categorías
            </p>
          </div>
        </div>

        <DataGrid<CategorySuggestion>
          data={suggestionsPromise.data}
          columns={columns}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
          searchPlaceholder="Buscar sugerencia..."
          enableSearch
          enablePagination
          enableSorting
          emptyText="No se encontraron sugerencias"
          onCreate={handleCreate}
          createText="Sugerir categoría"
          createPermissions={[PERMISSION_ENUM.SUPPLIER_CREATE]}
        />
      </div>

      <CreateSuggestionModal
        open={createModalState.open}
        onClose={() => closeModal("create-suggestion")}
      />
    </div>
  );
}
