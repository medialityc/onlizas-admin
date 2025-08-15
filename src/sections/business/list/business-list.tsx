"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { useModalState } from "@/hooks/use-modal-state";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";

import { useQueryClient } from "@tanstack/react-query";
import BusinessModalContainer from "../modals/business-modal-container";
import { Business, GetAllBusiness } from "@/types/business";
import { deleteBusiness } from "@/services/business";

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
  const queryClient = useQueryClient();

  const createBusinessModal = getModalState("create");
  const editBusinessModal = getModalState<number>("edit");
  const viewBusinessModal = getModalState<number>("view");

  const selectedBusiness = useMemo(() => {
    const id = editBusinessModal.id || viewBusinessModal.id;
    if (!id || !data?.data) return null;
    return data.data.find((business) => business.id == id);
  }, [editBusinessModal, viewBusinessModal, data?.data]);

  const handleCreateBusiness = useCallback(
    () => openModal("create"),
    [openModal]
  );

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

  const handleDeleteBusiness = useCallback(
    async (business: Business) => {
      try {
        const res = await deleteBusiness(business.id);
        if (res?.error && res.message) {
          console.error(res);
          showToast(res.message, "error");
        } else {
          queryClient.invalidateQueries({ queryKey: ["business"] });
          showToast("Business deleted successfully", "success");
        }
      } catch (error) {
        console.error(error);
        showToast("An error occurred, please try again", "error");
      }
    },
    [queryClient]
  );

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
                : business.description}
            </span>
          </div>
        ),
      },
      /* {
        accessor: "locationId",
        title: "ID Ubicación",
        render: (business) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {business.locationId}
          </span>
        ),
      }, */
      {
        accessor: "hblInitial",
        title: "HBL Inicial",
        render: (business) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {business.hblInitial}
          </span>
        ),
      },
      {
        accessor: "address",
        title: "Dirección",
        render: (business) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {business.address}
          </span>
        ),
      },
      {
        accessor: "email",
        title: "Email",
        render: (business) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {business.email}
          </span>
        ),
      },
      {
        accessor: "phone",
        title: "Teléfono",
        render: (business) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {business.phone}
          </span>
        ),
      },
      {
        accessor: "isPrimary",
        title: "Es Primario",
        render: (business) => (
          <span
            className={`text-sm font-medium ${
              business.isPrimary
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {business.isPrimary ? "Sí" : "No"}
          </span>
        ),
      },
      {
        accessor: "fixedRate",
        title: "Tarifa Fija",
        render: (business) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {business.fixedRate}
          </span>
        ),
      },
      {
        accessor: "invoiceText",
        title: "Texto Factura",
        render: (business) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {business.invoiceText}
          </span>
        ),
      },
      /* {
      accessor: "users",
      title: "Usuarios",
      render: (business) => (
        <span className="text-sm text-gray-500 dark:text-gray-300">
          {business.users?.map((u) => u.name).join(", ") || "-"}
        </span>
      ),
    }, */
      /* {
        accessor: "parentBusiness",
        title: "Negocio Padre",
        render: (business) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {business.parentBusiness.name || "-"}
          </span>
        ),
      },
      {
        accessor: "childBusinessIds",
        title: "Negocios Hijos",
        render: (business) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {business.childBusinessIds?.length
              ? business.childBusinessIds.join(", ")
              : "-"}
          </span>
        ),
      }, */
      {
        accessor: "actions",
        title: "Actions",
        textAlign: "center",
        render: (business) => (
          <div className="flex justify-center">
            <ActionsMenu
              onViewDetails={() => handleViewBusiness(business)}
              onEdit={() => handleEditBusiness(business)}
              onDelete={() => handleDeleteBusiness(business)}
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
        searchPlaceholder="Search businesses..."
        emptyText="No businesses found"
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
