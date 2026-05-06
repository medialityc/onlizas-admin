"use client";

import { useMemo, useState, useCallback } from "react";
import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllCategorySuggestions, CategorySuggestion } from "@/types/category-suggestions";
import { DataGrid } from "@/components/datagrid/datagrid";
import type { DataTableColumn } from "mantine-datatable";
import { NavigationTabs } from "@/components/tab/navigation-tabs";
import { categorySuggestionsTabs } from "../config/tabs";
import Badge from "@/components/badge/badge";
import ActionsMenu from "@/components/menu/actions-menu";
import { CategorySuggestionState } from "../constants/suggestion-state";
import ReviewSuggestionModal from "../modals/review-suggestion-modal";
import { useModalState } from "@/hooks/use-modal-state";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface Props {
  suggestionsPromise: ApiResponse<GetAllCategorySuggestions>;
  query: SearchParams;
}

export default function CategorySuggestionsAdminContainer({
  suggestionsPromise,
  query,
}: Props) {
  const { updateFiltersInUrl } = useFiltersUrl();
  const { getModalState, openModal, closeModal } = useModalState();
  const [selectedSuggestion, setSelectedSuggestion] = useState<CategorySuggestion | null>(null);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  const handleViewDetails = useCallback(
    (suggestion: CategorySuggestion) => {
      setSelectedSuggestion(suggestion);
      openModal("review", suggestion.id);
    },
    [openModal],
  );

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
        accessor: "suggestedByUserName",
        title: "Proveedor",
        render: (s) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {s.suggestedByUserName ?? "-"}
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
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (s) => (
          <div className="flex justify-center">
            <ActionsMenu
              onViewDetails={() => handleViewDetails(s)}
              viewPermissions={[PERMISSION_ENUM.RETRIEVE]}
            />
          </div>
        ),
      },
    ],
    [handleViewDetails],
  );

  const reviewModalState = getModalState("review");

  return (
    <div className="space-y-6">
      <div className="panel flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Sugerencias de categorías
            </h1>
            <p className="text-muted-foreground mt-1">
              Revisa y gestiona las sugerencias de nuevas categorías
            </p>
          </div>
        </div>

        <NavigationTabs tabs={categorySuggestionsTabs} />

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
        />
      </div>

      <ReviewSuggestionModal
        open={reviewModalState.open}
        onClose={() => closeModal("review")}
        suggestion={selectedSuggestion}
      />
    </div>
  );
}
