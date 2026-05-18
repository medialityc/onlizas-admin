"use client";

import { useMemo, useState, useCallback } from "react";
import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllClaims, Claim } from "@/types/claims";
import { DataGrid } from "@/components/datagrid/datagrid";
import type { DataTableColumn } from "mantine-datatable";
import Badge from "@/components/badge/badge";
import ActionsMenu from "@/components/menu/actions-menu";
import { ClaimStatus, statusVariantMap } from "../constants/claim-status";
import { typeLabelMap } from "../constants/claim-type";
import ResolveClaimModal from "../modals/resolve-claim-modal";
import ViewClaimModal from "../modals/view-claim-modal";
import { useModalState } from "@/hooks/use-modal-state";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface Props {
  claimsPromise: ApiResponse<GetAllClaims>;
  query: SearchParams;
}

export default function ClaimsAdminContainer({ claimsPromise, query }: Props) {
  const { updateFiltersInUrl } = useFiltersUrl();
  const { getModalState, openModal, closeModal } = useModalState();
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  const handleViewDetails = useCallback(
    (claim: Claim) => {
      setSelectedClaim(claim);
      openModal("view", claim.id);
    },
    [openModal],
  );

  const handleResolve = useCallback(
    (claim: Claim) => {
      setSelectedClaim(claim);
      openModal("resolve", claim.id);
    },
    [openModal],
  );

  const columns: DataTableColumn<Claim>[] = useMemo(
    () => [
      {
        accessor: "type",
        title: "Tipo",
        width: 180,
        sortable: true,
        render: (c) => (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {typeLabelMap[c.type]}
          </span>
        ),
      },
      {
        accessor: "status",
        title: "Estado",
        sortable: true,
        render: (c) => {
          const info = statusVariantMap[c.status];
          return (
            <Badge variant={info.variant} rounded>
              {info.label}
            </Badge>
          );
        },
      },
      {
        accessor: "claimedAmount",
        title: "Monto Reclamado",
        sortable: true,
        render: (c) => (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {c.claimedAmount}
          </span>
        ),
      },
      {
        accessor: "createdAt",
        title: "Fecha Creación",
        sortable: true,
        render: (c) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}
          </span>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (c) => (
          <div className="flex justify-center">
            <ActionsMenu
              onViewDetails={() => handleViewDetails(c)}
              viewPermissions={[PERMISSION_ENUM.RETRIEVE]}
              onEdit={
                c.status === ClaimStatus.PENDING
                  ? () => handleResolve(c)
                  : undefined
              }
              editPermissions={[PERMISSION_ENUM.UPDATE]}
            />
          </div>
        ),
      },
    ],
    [handleViewDetails, handleResolve],
  );

  const viewModalState = getModalState("view");
  const resolveModalState = getModalState("resolve");

  return (
    <div className="space-y-6">
      <div className=" flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Reclamaciones</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona las reclamaciones de los clientes
            </p>
          </div>
        </div>

        <DataGrid<Claim>
          data={claimsPromise.data}
          columns={columns}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
          searchPlaceholder="Buscar reclamación..."
          enableSearch
          enablePagination
          enableSorting
          emptyText="No se encontraron reclamaciones"
        />
      </div>

      <ViewClaimModal
        open={viewModalState.open}
        onClose={() => closeModal("view")}
        claim={selectedClaim}
      />

      <ResolveClaimModal
        open={resolveModalState.open}
        onClose={() => closeModal("resolve")}
        claim={selectedClaim}
      />
    </div>
  );
}
