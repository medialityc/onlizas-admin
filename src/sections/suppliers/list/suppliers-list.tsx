"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { useModalState } from "@/hooks/use-modal-state";
import { SearchParams } from "@/types/fetch/request";
import { GetAllSuppliers, processesState, Supplier } from "@/types/suppliers";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import SuppliersModalContainer from "../modals/suppliers-modal-container";
import SupplierExpirationModal from "../modals/supplier-expiration-modal";
import SupplierRateModal from "../modals/supplier-rate-modal";
import { deleteSuppliers } from "@/services/supplier";
import { PERMISSION_ENUM } from "@/lib/permissions";
import {
  SUPPLIER_TYPE,
  SUPPLIER_TYPE_OPTIONS,
  SUPPLIER_TYPE_OPTIONS_DET,
} from "../constants/supplier.options";

interface SuppliersListProps {
  data?: GetAllSuppliers;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function SuppliersList({
  data,
  searchParams,
  onSearchParamsChange,
}: SuppliersListProps) {
  const router = useRouter();
  const { openModal, getModalState, closeModal } = useModalState();

  const createSupplierModal = getModalState("create");
  const editSupplierModal = getModalState<string>("edit");
  const viewSupplierModal = getModalState<string>("view");
  const expirationModal = getModalState<string>("supplierExpiration");
  const rateModal = getModalState<string>("supplierRate");

  const selectedSupplier = useMemo(() => {
    const editId = editSupplierModal.id;
    const viewId = viewSupplierModal.id;
    const targetId = editId || viewId;

    if (!targetId || !data?.data) return undefined;

    // Convertir targetId a número para comparación
    const numericId = targetId;

    return data.data.find((supplier) => supplier.id === numericId);
  }, [editSupplierModal.id, viewSupplierModal.id, data?.data]);

  const expirationSupplier = useMemo(() => {
    const targetId = expirationModal.id;
    if (!targetId || !data?.data) return undefined;
    return data.data.find((supplier) => supplier.id === targetId);
  }, [expirationModal.id, data?.data]);

  const rateSupplier = useMemo(() => {
    const targetId = rateModal.id;
    if (!targetId || !data?.data) return undefined;
    return data.data.find((supplier) => supplier.id === targetId);
  }, [rateModal.id, data?.data]);

  const handleCreateSupplier = useCallback(
    () => openModal("create"),
    [openModal],
  );

  const handleViewSupplier = useCallback(
    (supplier: Supplier) => {
      openModal<string>("view", supplier.id);
    },
    [openModal],
  );

  const handleEditFullSupplier = useCallback(
    (supplier: Supplier) => {
      router.push(`/dashboard/suppliers/${supplier.id}`);
    },
    [router],
  );

  const handleChangeExpiration = useCallback(
    (supplier: Supplier) => {
      openModal<string>("supplierExpiration", supplier.id);
    },
    [openModal],
  );

  const handleChangeRate = useCallback(
    (supplier: Supplier) => {
      openModal<string>("supplierRate", supplier.id);
    },
    [openModal],
  );

  const handleToggleActiveSupplier = useCallback(async (supplier: Supplier) => {
    try {
      const res = await deleteSuppliers(supplier.id);
      if (res?.error && res.message) {
        console.error(res);
        showToast(res.message, "error");
      } else {
        showToast(
          `Proveedor ${res.data?.active ? "activado" : "desactivado"} eliminado correctamente`,
          "success",
        );
      }
    } catch (error) {
      console.error(error);
      showToast("Ocurrió un error, intente nuevamente", "error");
    }
  }, []);

  const columns = useMemo<DataTableColumn<Supplier>[]>(
    () => [
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (supplier) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {supplier.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {supplier.email}
            </span>
          </div>
        ),
      },
      {
        accessor: "nacionality",
        title: "Nacionalidad",
        sortable: true,
        render: (supplier) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {supplier.nacionality || "No disponible"}
          </span>
        ),
      },
      {
        accessor: "sellerType",
        title: "Tipo de vendedor",
        sortable: true,
        render: (supplier) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {supplier.sellerType || "No disponible"}
          </span>
        ),
      },
      {
        accessor: "expirationDate",
        title: "Fecha de Expiración",
        sortable: true,
        width: 150,
        render: (supplier) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {supplier.expirationDate
              ? new Date(supplier.expirationDate).toLocaleDateString("es-ES")
              : "No disponible"}
          </span>
        ),
      },
      {
        accessor: "fixedTax",
        title: "Tarifa Fija",
        sortable: true,
        width: 120,
        render: (supplier) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {supplier.fixedTax ? `${supplier.fixedTax}%` : "No disponible"}
          </span>
        ),
      },
      {
        accessor: "active",
        title: "Estado",
        sortable: true,
        width: 100,
        render: (supplier) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              supplier.active
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {supplier.active ? "Activo" : "Inactivo"}
          </span>
        ),
      },
      {
        accessor: "isAproved",
        title: "Aprobación",
        sortable: true,
        width: 120,
        render: (supplier) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              supplier.state === "Approved"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            }`}
          >
            {
              processesState.find((state) => state.value === supplier.state)
                ?.name
            }
          </span>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (supplier) => (
          <div className="flex justify-center">
            <ActionsMenu
              active={supplier.active}
              onActive={() => handleToggleActiveSupplier(supplier)}
              onViewDetails={() => handleViewSupplier(supplier)}
              onEdit={() => handleEditFullSupplier(supplier)}
              viewPermissions={[PERMISSION_ENUM.RETRIEVE]}
              editPermissions={[PERMISSION_ENUM.UPDATE]}
              onChangeExpirationDate={() => handleChangeExpiration(supplier)}
              onChangeRate={() => handleChangeRate(supplier)}
              changeExpirationPermissions={[PERMISSION_ENUM.UPDATE]}
              changeRatePermissions={[PERMISSION_ENUM.UPDATE]}
              activePermissions={[
                PERMISSION_ENUM.UPDATE,
                PERMISSION_ENUM.DELETE,
              ]}
            />
          </div>
        ),
      },
    ],
    [handleViewSupplier, handleEditFullSupplier, handleToggleActiveSupplier],
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar solicitudes..."
        onCreate={handleCreateSupplier}
        emptyText="No se encontraron solicitudes"
        createPermissions={[PERMISSION_ENUM.CREATE]}
      />

      {/* Create Modal */}
      <SuppliersModalContainer
        open={createSupplierModal.open}
        onClose={() => closeModal("create")}
      />

      {/* Details Modal */}
      {selectedSupplier && (
        <SuppliersModalContainer
          onClose={() => closeModal("view")}
          open={viewSupplierModal.open}
          supplier={selectedSupplier}
          isDetailsView
        />
      )}

      {expirationSupplier && (
        <SupplierExpirationModal
          open={expirationModal.open}
          onClose={() => closeModal("supplierExpiration")}
          supplier={expirationSupplier}
        />
      )}

      {rateSupplier && (
        <SupplierRateModal
          open={rateModal.open}
          onClose={() => closeModal("supplierRate")}
          supplier={rateSupplier}
        />
      )}
    </>
  );
}
