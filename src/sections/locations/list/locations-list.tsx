"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { useModalState } from "@/hooks/use-modal-state";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo, useState } from "react";
// import { useQueryClient } from "@tanstack/react-query"; // Comentado: Solo lectura
import LocationsModalContainer from "../modals/locations-modal-container";
// import LocationDeleteModal from "../modals/location-delete-modal"; // Comentado: Solo lectura
import LocationExportModal from "../components/location-export-modal";
import { ILocation, GetAllLocations, LocationStatus } from "@/types/locations";
import StatusBadge from "@/components/badge/status-badge";
// import { updateLocationStatus } from "@/services/locations"; // Comentado: Solo lectura
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface LocationsListProps {
  data?: GetAllLocations;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

const LOCATION_TYPE_LABELS = [
  "Almacén",
  "Negocio",
  "Centro de distribución",
  "Punto de recogida",
  "Oficina",
  "Otro",
];

const LOCATION_STATUS_LABELS = {
  0: "Activo",
  1: "Inactivo",
  2: "Eliminado",
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
  DELETE: "Eliminado",
};

const getLocationTypeLabel = (type: number): string =>
  LOCATION_TYPE_LABELS[type] || "-";

const getLocationStatusLabel = (status: string | number): string => {
  if (status === 0 || status === 1 || status === 2)
    return LOCATION_STATUS_LABELS[status];
  return (
    LOCATION_STATUS_LABELS[status as keyof typeof LOCATION_STATUS_LABELS] ||
    String(status)
  );
};

const isLocationActive = (location: ILocation): boolean =>
  location.status === 0; // Solo verificamos el valor numérico

const canToggleStatus = (location: ILocation): boolean =>
  location.status !== 2; // Solo verificamos el valor numérico

export function LocationsList({
  data,
  searchParams,
  onSearchParamsChange,
}: LocationsListProps) {
  const { getModalState, openModal, closeModal } = useModalState();
  // const [showDeleteModal, setShowDeleteModal] = useState(false); // Comentado: Solo lectura
  const [showExportModal, setShowExportModal] = useState(false);
  // const [locationToDelete, setLocationToDelete] = useState<ILocation | null>(null); // Comentado: Solo lectura
  const { hasPermission } = usePermissions();
  const hasReadPermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);

  // const queryClient = useQueryClient(); // Comentado: Solo lectura

  // const createLocationModal = getModalState("create"); // Comentado: Solo lectura
  // const editLocationModal = getModalState<number>("edit"); // Comentado: Solo lectura
  const viewLocationModal = getModalState<number>("view");

  const selectedLocation = useMemo(() => {
    const id = viewLocationModal.id; // Solo para ver detalles
    if (!id || !data?.data) return null;
    return data.data.find((location) => location.id === String(id));
  }, [viewLocationModal, data?.data]);

  // Comentado: Funcionalidad de crear localización
  // const handleCreateLocation = useCallback(() => {
  //   openModal("create");
  // }, [openModal]);

  // Comentado: Funcionalidad de editar localización
  // const handleEditLocation = useCallback(
  //   (location: ILocation) => {
  //     openModal<number | string>("edit", location.id);
  //   },
  //   [openModal]
  // );

  const handleViewLocation = useCallback(
    (location: ILocation) => {
      openModal<number | string>("view", location.id);
    },
    [openModal]
  );

  // Comentado: Funcionalidad de eliminar localización
  // const handleDeleteLocation = useCallback((location: ILocation) => {
  //   setLocationToDelete(location);
  //   setShowDeleteModal(true);
  // }, []);

  // Comentado: Funcionalidad de cambiar estado de localización
  // const handleToggleStatus = useCallback(
  //   async (location: ILocation) => {
  //     try {
  //       const response = await updateLocationStatus(location.id);

  //       if (response.error) {
  //         showToast(
  //           response.message || "Error al cambiar el estado de la ubicación",
  //           "error"
  //         );
  //         return;
  //       }

  //       queryClient.invalidateQueries({ queryKey: ["locations"] });

  //       // Determinar el nuevo estado basado en el estado actual
  //       const newStatus = isLocationActive(location) ? "Inactivo" : "Activo";

  //       showToast(
  //         `Ubicación ${newStatus === "Activo" ? "activada" : "desactivada"} exitosamente`,
  //         "success"
  //       );
  //     } catch (error) {
  //       console.error("Error toggling location status:", error);
  //       showToast("Error al cambiar el estado de la ubicación", "error");
  //     }
  //   },
  //   [queryClient]
  // );

  const columns = useMemo<DataTableColumn<ILocation>[]>(
    () => [
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
        accessor: "addressRaw",
        title: "Dirección",
        render: (location) => (
          <div className="max-w-xs">
            <span className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {location.addressRaw?.length > 100
                ? `${location.addressRaw.substring(0, 100)}...`
                : (location.addressRaw ?? "-")}
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
        accessor: "countryCode",
        title: "País",
        render: (location) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {location.countryCode ?? "-"}
          </span>
        ),
      },
      {
        accessor: "type",
        title: "Tipo",
        render: (location) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {getLocationTypeLabel(location.type)}
          </span>
        ),
      },
      {
        accessor: "status",
        title: "Estado",
        render: (location) => {
          const statusLabel = getLocationStatusLabel(location.status);
          const active = isLocationActive(location);

          return (
            <StatusBadge
              active={active}
              activeText={statusLabel}
              inactiveText={statusLabel}
            />
          );
        },
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (location) => (
          <div className="flex justify-center">
            <ActionsMenu
              active={isLocationActive(location)}
              onViewDetails={() => handleViewLocation(location)}
              // Comentado: Funcionalidades de edición, eliminación y cambio de estado
              // onEdit={() => handleEditLocation(location)}
              // onDelete={
              //   !isLocationActive(location)
              //     ? () => handleDeleteLocation(location)
              //     : undefined
              // }
              // onActive={
              //   canToggleStatus(location)
              //     ? () => handleToggleStatus(location)
              //     : undefined
              // }
              viewPermissions={[PERMISSION_ENUM.RETRIEVE]}
              // editPermissions={[PERMISSION_ENUM.UPDATE]}
              // deletePermissions={[PERMISSION_ENUM.DELETE]}
              // activePermissions={[PERMISSION_ENUM.UPDATE]}
            />
          </div>
        ),
      },
    ],
    [
      handleViewLocation,
      // Comentado: dependencias de funciones de edición/eliminación
      // handleEditLocation,
      // handleDeleteLocation,
      // handleToggleStatus,
    ]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar localizaciones..."
        emptyText="No se encontraron localizaciones"
        // Comentado: Funcionalidad de crear localización
        // onCreate={handleCreateLocation}
        // createPermissions={[PERMISSION_ENUM.CREATE]}
        rightActions={
          //poner lo del read luegp que se defina la ofrma
          hasReadPermission && (
            <button
              onClick={() => setShowExportModal(true)}
              className="btn btn-outline-primary"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Exportar
            </button>
          )
        }
      />
      {/* Comentado: Modal de creación */}
      {/* <LocationsModalContainer
        onClose={() => closeModal("create")}
        open={createLocationModal.open}
      /> */}
      {/* Comentado: Modal de edición */}
      {/* {selectedLocation && (
        <LocationsModalContainer
          onClose={() => closeModal("edit")}
          open={editLocationModal.open}
          location={selectedLocation}
        />
      )} */}
      {/* Details Modal - Solo lectura */}
      {selectedLocation && (
        <LocationsModalContainer
          onClose={() => closeModal("view")}
          open={viewLocationModal.open}
          location={selectedLocation}
          isDetailsView
        />
      )}
      {/* Comentado: Modal de eliminación */}
      {/* <LocationDeleteModal
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
      /> */}
      {/* Export Modal */}
      <LocationExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        appliedFilters={searchParams}
      />
    </>
  );
}
