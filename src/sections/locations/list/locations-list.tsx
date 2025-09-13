"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { useModalState } from "@/hooks/use-modal-state";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo, useState } from "react";
import LocationsModalContainer from "../modals/locations-modal-container";
import LocationDeleteModal from "../modals/location-delete-modal";
import LocationExportModal from "../components/location-export-modal";
import { ILocation, GetAllLocations } from "@/types/locations";
import StatusBadge from "@/components/badge/status-badge";
import { usePermissions } from "@/auth-sso/permissions-control/hooks";

interface LocationsListProps {
  data?: GetAllLocations;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

const LOCATION_TYPE_MAP: Record<string, string> = {
  // Mapeo por si el backend devuelve números
  "0": "Almacén",
  "1": "Negocio",
  "2": "Punto de recogida", 
  "3": "Hub",
  "4": "Otro"
};

const getLocationTypeLabel = (type: string | number | undefined): string => {
  if (!type) return "-";
  const typeKey = String(type);
  return LOCATION_TYPE_MAP[typeKey] || typeKey;
};

interface LocationsListProps {
  data?: GetAllLocations;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function LocationsList({
  data,
  searchParams,
  onSearchParamsChange,
}: LocationsListProps) {
  const { getModalState, openModal, closeModal } = useModalState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<ILocation | null>(null);
  const { data: permissions = [] } = usePermissions();
  const hasReadPermission = permissions.some(p => p.code === "READ_ALL");

  const createLocationModal = getModalState("create");
  const editLocationModal = getModalState<number>("edit");
  const viewLocationModal = getModalState<number>("view");

  const selectedLocation = useMemo(() => {
    const id = editLocationModal.id || viewLocationModal.id;
    if (!id || !data?.data) return null;
    return data.data.find((location) => location.id == id);
  }, [editLocationModal, viewLocationModal, data?.data]);

  const handleCreateLocation = useCallback(() => {
    openModal("create");
  }, [openModal]);

  const handleEditLocation = useCallback(
    (location: ILocation) => {
      openModal<number>("edit", location.id);
    },
    [openModal]
  );

  const handleViewLocation = useCallback(
    (location: ILocation) => {
      openModal<number>("view", location.id);
    },
    [openModal]
  );

  const handleDeleteLocation = useCallback((location: ILocation) => {
    setLocationToDelete(location);
    setShowDeleteModal(true);
  }, []);

  const columns = useMemo<DataTableColumn<ILocation>[]>(() => [
    {
      accessor: "id",
      title: "ID",
      sortable: true,
      width: 80,
      render: (location) => (
        <span className="font-medium text-dark dark:text-white">
          #{location.id}
        </span>
      ),
    },
    {
      accessor: "name",
      title: "Nombre",
      sortable: true,
      render: (location) => (
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {location.name}
        </span>
      ),
    },
    {
      accessor: "address_raw",
      title: "Dirección",
      render: (location) => (
        <div className="max-w-xs">
          <span className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {location.address_raw?.length > 100
              ? `${location.address_raw.substring(0, 100)}...`
              : (location.address_raw ?? "-")}
          </span>
        </div>
      ),
    },
    {
      accessor: "state",
      title: "Estado",
      render: (location) => (
        <span className="text-sm text-gray-500 dark:text-gray-300">
          {location.state ?? "-"}
        </span>
      ),
    },
    {
      accessor: "district",
      title: "Distrito",
      render: (location) => (
        <span className="text-sm text-gray-500 dark:text-gray-300">
          {location.district ?? "-"}
        </span>
      ),
    },
    {
      accessor: "country_code",
      title: "País",
      render: (location) => (
        <span className="text-sm text-gray-500 dark:text-gray-300">
          {location.country_code ?? "-"}
        </span>
      ),
    },
    {
      accessor: "type",
      title: "Tipo",
      render: (location) => (
        <span className="text-sm text-gray-500 dark:text-gray-300">
          {getLocationTypeLabel(location.type)??"-"}
        </span>
      ),
    },
    {
      accessor: "status",
      title: "Estado",
      render: (location) => (
        <StatusBadge
          isActive={location.status === "ACTIVE"}
          activeText="Activo"
          inactiveText="Inactivo"
        />
      ),
    },
    {
      accessor: "actions",
      title: "Acciones",
      textAlign: "center",
      render: (location) => (
        <div className="flex justify-center">
          <ActionsMenu
            isActive={location.status === "ACTIVE"}
            onViewDetails={() => handleViewLocation(location)}
            onEdit={() => handleEditLocation(location)}
            onDelete={() => handleDeleteLocation(location)}
            viewPermissions={["READ_ALL"]}
            editPermissions={["UPDATE_ALL"]}
            deletePermissions={["DELETE_ALL"]}
          />
        </div>
      ),
    },
  ], [handleViewLocation, handleEditLocation, handleDeleteLocation]);

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar localizaciones..."
        emptyText="No se encontraron localizaciones"
        onCreate={handleCreateLocation}
        createPermissions={["CREATE_ALL"]}
        rightActions={
          //poner lo del read luegp que se defina la ofrma 
          hasReadPermission && (
          <button
            onClick={() => setShowExportModal(true)}
            className="btn btn-outline-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar
          </button>
          )
        }
      />
      {/* Create Modal */}
      <LocationsModalContainer
        onClose={() => closeModal("create")}
        open={createLocationModal.open}
      />
      {/* Edit Modal */}
      {selectedLocation && (
        <LocationsModalContainer
          onClose={() => closeModal("edit")}
          open={editLocationModal.open}
          location={selectedLocation}
        />
      )}
      {/* Details Modal */}
      {selectedLocation && (
        <LocationsModalContainer
          onClose={() => closeModal("view")}
          open={viewLocationModal.open}
          location={selectedLocation}
          isDetailsView
        />
      )}
      {/* Delete Modal */}
      <LocationDeleteModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setLocationToDelete(null);
        }}
        location={locationToDelete}
        onSuccess={() => {
          setShowDeleteModal(false);
          setLocationToDelete(null);
          // Refresh the list or handle success
        }}
      />
      {/* Export Modal */}
      <LocationExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        appliedFilters={searchParams}
      />
    </>
  );
}
