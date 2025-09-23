"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { useRegionModalState } from "../../hooks/use-region-modal-state";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Region } from "@/types/regions";
import { deleteRegion } from "@/services/regions";
import StatusBadge from "@/components/badge/status-badge";
import { PaginatedResponse } from "@/types/common";
import RegionModalContainer from "../../modals/region-modal-container";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

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
  const queryClient = useQueryClient();
 

  const createModal = getModalState("create");
  const editModal = getModalState("edit");
  const viewModal = getModalState("view");
  const configureModal = getModalState("configure");

  const selectedRegion = useMemo(() => {
    const id = editModal.id || viewModal.id || configureModal.id;
    if (!id || !data?.data) return null;
    return data.data.find((region) => region.id === id) ?? null;
  }, [editModal, viewModal, configureModal, data?.data]);
    
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

  const handleConfigureRegion = useCallback(
    (region: Region) => {
      openModal("configure", region.id);
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
        // Invalidar queries para refrescar desde el backend
        queryClient.invalidateQueries({ queryKey: ["regions"] });
      }
    } catch (error) {
      console.error(error);
      showToast("Ocurrió un error, por favor intenta de nuevo", "error");
    }
  }, [queryClient]);

  // Helper function to get status text
  const getStatusText = (status: Region['status']) => {
    switch (status) {
      case 0: return "Activa";
      case 1: return "Inactiva";
      case 2: return "Eliminada";
      default: return "Desconocido";
    }
  };

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
            isActive={region.status === 0}
            activeText="Activa"
            inactiveText={getStatusText(region.status)}
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
          
          <div className="flex justify-center items-center gap-2">
            <ActionsMenu
              onViewDetails={() => handleViewRegion(region)}
              onEdit={() => handleEditRegion(region)}
              onDelete={region.status === 1 ? () => handleDeleteRegion(region) : undefined}
              viewPermissions={["READ_ALL"]}
              editPermissions={["UPDATE_ALL"]}
              deletePermissions={["DELETE_ALL"]}
            />
            {region.status === 0 && (
              <button
                onClick={() => handleConfigureRegion(region)}
                className=" btn-sm  flex items-center justify-center"
                title="Configurar monedas, pagos y envío"
              >
                <Cog6ToothIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [handleViewRegion, handleEditRegion, handleDeleteRegion, getStatusText]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar regiones..."
        emptyText="No se encontraron regiones"
        onCreate={handleCreateRegion}
        createPermissions={["CREATE_ALL"]}
      />

      {/* Create Modal */}
      {createModal.open && (
        <RegionModalContainer
          onClose={() => closeModal("create")}
          open={createModal.open}
          onSuccess={() => {
            // Invalidar queries para refrescar desde el backend
            queryClient.invalidateQueries({ queryKey: ["regions"] });
          }}
        />
      )}

      {/* Edit Modal */}
      {selectedRegion && (
        <RegionModalContainer
          onClose={() => closeModal("edit")}
          open={editModal.open}
          region={selectedRegion}
          onSuccess={() => {
            // Invalidar queries para refrescar desde el backend
            queryClient.invalidateQueries({ queryKey: ["regions"] });
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

      {/* Configure Modal */}
      {selectedRegion && (
        <RegionModalContainer
          onClose={() => closeModal("configure")}
          open={configureModal.open}
          region={selectedRegion}
          isConfigView
          onSuccess={() => {
            // Invalidar queries para refrescar desde el backend
            queryClient.invalidateQueries({ queryKey: ["regions"] });
          }}
        />
      )}

      
    </>
  );
}
