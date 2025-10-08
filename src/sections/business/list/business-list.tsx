"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { useModalState } from "@/hooks/use-modal-state";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";
import BusinessModalContainer from "../modals/business-modal-container";
import { Business, GetAllBusiness } from "@/types/business";
import { deleteBusiness } from "@/services/business";
import StatusBadge from "@/components/badge/status-badge";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface BusinessListProps {
  data?: GetAllBusiness;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function BusinessList({
  data,
  searchParams,
  onSearchParamsChange,
}: BusinessListProps) {
  const { getModalState, openModal, closeModal } = useModalState();

  const editBusinessModal = getModalState<number>("edit");
  const viewBusinessModal = getModalState<number>("view");

  const selectedBusiness = useMemo(() => {
    const id = editBusinessModal.id || viewBusinessModal.id;
    if (!id || !data?.data) return null;
    return data.data.find((business) => business.id == id);
  }, [editBusinessModal, viewBusinessModal, data?.data]);

  const handleEditBusiness = useCallback(
    (business: Business) => {
      openModal<number>("edit", business.id);
    },
    [openModal]
  );

  const handleViewBusiness = useCallback(
    (business: Business) => {
      openModal<number>("view", business.id);
    },
    [openModal]
  );

  const handleDeleteBusiness = useCallback(async (business: Business) => {
    try {
      const res = await deleteBusiness(business.id);
      if (res?.error && res.message) {
        console.error(res);
        showToast(res.message, "error");
      } else {
        showToast("Negocio desactivado exitosamente", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Ocurrió un error, por favor intenta de nuevo", "error");
    }
  }, []);

  const columns = useMemo<DataTableColumn<Business>[]>(
    () => [
      {
        accessor: "id",
        title: "ID",
        sortable: true,
        width: 80,
        render: (business) => (
          <span className="font-medium text-dark dark:text-white">
            #{business.id}
          </span>
        ),
      },
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (business) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {business.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {business.code}
            </span>
          </div>
        ),
      },
      {
        accessor: "description",
        title: "Description",
        render: (business) => (
          <div className="max-w-xs">
            <span className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {business.description?.length > 100
                ? `${business.description.substring(0, 100)}...`
                : (business.description ?? "-")}
            </span>
          </div>
        ),
      },
      {
        accessor: "address",
        title: "Dirección",
        render: (business) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {business.address ?? "-"}
          </span>
        ),
      },
      {
        accessor: "email",
        title: "Correo",
        render: (business) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {business.email ?? "-"}
          </span>
        ),
      },
      {
        accessor: "phone",
        title: "Teléfono",
        render: (business) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {business.phone ?? "-"}
          </span>
        ),
      },
      {
        accessor: "isActive",
        title: "Estado",
        render: (business) => (
          <StatusBadge
            isActive={business.isActive}
            activeText="Activo"
            inactiveText="Inactivo"
          />
        ),
      },
      {
        accessor: "actions",
        title: "Actions",
        textAlign: "center",
        render: (business) => (
          <div className="flex justify-center">
            <ActionsMenu
              isActive={business.isActive}
              onViewDetails={() => handleViewBusiness(business)}
              onEdit={() => handleEditBusiness(business)}
              onActive={() => handleDeleteBusiness(business)}
              viewPermissions={[PERMISSION_ENUM.RETRIEVE,PERMISSION_ENUM.RETRIEVE_SECTION]}
              editPermissions={[PERMISSION_ENUM.RETRIEVE,PERMISSION_ENUM.RETRIEVE_SECTION]}
              activePermissions={[PERMISSION_ENUM.DELETE, PERMISSION_ENUM.UPDATE_BUSINESS]}
            />
          </div>
        ),
      },
    ],
    [handleViewBusiness, handleEditBusiness, handleDeleteBusiness]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar negocios..."
        emptyText="No se encontraron negocios"
      />
      {/* Edit Modal */}
      {selectedBusiness && (
        <BusinessModalContainer
          onClose={() => closeModal("edit")}
          open={editBusinessModal.open}
          business={selectedBusiness}
        />
      )}
      {/* Details Modal */}
      {selectedBusiness && (
        <BusinessModalContainer
          onClose={() => closeModal("view")}
          open={viewBusinessModal.open}
          business={selectedBusiness}
          isDetailsView
        />
      )}
    </>
  );
}
