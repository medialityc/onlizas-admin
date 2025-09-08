"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { useRegionModalState } from "../../hooks/use-region-modal-state";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo, useState, useEffect } from "react";

import { Region } from "@/types/regions";
import { deleteRegion } from "@/services/regions";
import StatusBadge from "@/components/badge/status-badge";
import { PaginatedResponse } from "@/types/common";
import RegionModalContainer from "../../modals/region-modal-container";

interface RegionListProps {
  data?: PaginatedResponse<Region>;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function RegionList({
  data,
  searchParams,
  onSearchParamsChange,
}: RegionListProps) {
  const { getModalState, openModal, closeModal } = useRegionModalState();

  // Keep a client-side copy of the paginated data so UI updates after mutations
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const createModal = getModalState("create");
  const editModal = getModalState("edit");
  const viewModal = getModalState("view");

  const selectedRegion = useMemo(() => {
    const id = editModal.id || viewModal.id;
    if (!id || !data?.data) return null;
  return localData?.data?.find((region) => region.id === id) ?? null;
  }, [editModal, viewModal, data?.data]);

  const handleCreateRegion = useCallback(() => {
    openModal("create");
  }, [openModal]);

  const handleEditRegion = useCallback(
    (region: Region) => {
      openModal("edit", region.id);
    },
    [openModal]
  );

  const handleViewRegion = useCallback(
    (region: Region) => {
      openModal("view", region.id);
    },
    [openModal]
  );

  const handleDeleteRegion = useCallback(async (region: Region) => {
    try {
      const res = await deleteRegion(region.id);
      if (res?.error && res.message) {
        console.error(res);
        showToast(res.message, "error");
      } else {
        showToast("Región eliminada exitosamente", "success");
        // reflect deletion in local data: mark as deleted
        setLocalData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            data: prev.data.map(r => r.id === region.id ? { ...r, status: 'deleted' } : r)
          };
        });
      }
    } catch (error) {
      console.error(error);
      showToast("Ocurrió un error, por favor intenta de nuevo", "error");
    }
  }, []);

  const columns = useMemo<DataTableColumn<Region>[]>(
    () => [
      {
        accessor: "id",
        title: "ID",
        sortable: true,
        width: 80,
        render: (region) => (
          <span className="font-medium text-dark dark:text-white">
            #{region.id}
          </span>
        ),
      },
      {
        accessor: "code",
        title: "Código",
        sortable: true,
        render: (region) => (
          <span className="font-mono text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {region.code}
          </span>
        ),
      },
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (region) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {region.name}
            </span>
          </div>
        ),
      },
      {
        accessor: "description",
        title: "Descripción",
        render: (region) => (
          <div className="max-w-xs">
            <span className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {region.description || "-"}
            </span>
          </div>
        ),
      },
      {
        accessor: "status",
        title: "Estado",
        render: (region) => (
          <StatusBadge
            isActive={region.status === "active"}
            activeText="Activa"
            inactiveText={region.status === "inactive" ? "Inactiva" : "Eliminada"}
          />
        ),
      },
      {
        accessor: "createdAt",
        title: "Creada",
        sortable: true,
        render: (region) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {new Date(region.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (region) => (
          <div className="flex justify-center">
            <ActionsMenu
              isActive={region.status === "active"}
              onViewDetails={() => handleViewRegion(region)}
              onEdit={() => handleEditRegion(region)}
              onActive={() => handleDeleteRegion(region)}
            />
          </div>
        ),
      },
    ],
    [handleViewRegion, handleEditRegion, handleDeleteRegion]
  );

  return (
    <>
      <DataGrid
        data={localData}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar regiones..."
        emptyText="No se encontraron regiones"
        onCreate={handleCreateRegion}
      />

      {/* Create Modal */}
      {createModal.open && (
        <RegionModalContainer
          onClose={() => closeModal("create")}
          open={createModal.open}
          onSuccess={(newRegion?: Region) => {
            if (!newRegion) return;
            setLocalData(prev => {
              if (!prev) {
                return {
                  data: [newRegion],
                  totalCount: 1,
                  page: 1,
                  pageSize: 1,
                  hasNext: false,
                  hasPrevious: false,
                } as any;
              }
              return {
                ...prev,
                data: [newRegion, ...prev.data],
                totalCount: (prev.totalCount || prev.data.length) + 1,
              };
            });
          }}
        />
      )}

      {/* Edit Modal */}
      {selectedRegion && (
        <RegionModalContainer
          onClose={() => closeModal("edit")}
          open={editModal.open}
          region={selectedRegion}
          onSuccess={(updated?: Region) => {
            if (!updated) return;
            setLocalData(prev => {
              if (!prev) {
                return {
                  data: [updated],
                  totalCount: 1,
                  page: 1,
                  pageSize: 1,
                  hasNext: false,
                  hasPrevious: false,
                } as any;
              }
              return {
                ...prev,
                data: prev.data.map(r => (r.id === updated.id ? updated : r)),
              };
            });
          }}
        />
      )}

      {/* Details Modal */}
      {selectedRegion && (
        <RegionModalContainer
          onClose={() => closeModal("view")}
          open={viewModal.open}
          region={selectedRegion}
          isDetailsView
        />
      )}
    </>
  );
}
