"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { useModalState } from "@/hooks/use-modal-state";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";

import { useQueryClient } from "@tanstack/react-query";
import {
  Currency,
  GetAllCurrencies,
  deleteCurrency,
  setAsDefaultCurrency,
} from "@/services/currencies";
import CurrenciesModalContainer from "../modals/currencies-modal-container";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface CurrenciesListProps {
  data?: GetAllCurrencies;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function CurrenciesList({
  data,
  searchParams,
  onSearchParamsChange,
}: CurrenciesListProps) {
  const { getModalState, openModal, closeModal } = useModalState();
  const queryClient = useQueryClient();

  const createCurrencyModal = getModalState("create");
  const editCurrencyModal = getModalState<string | number>("edit");
  const viewCurrencyModal = getModalState<string | number>("view");

  const selectedCurrency = useMemo(() => {
    const id = editCurrencyModal.id || viewCurrencyModal.id;
    if (!id || !data?.data) return null;
    return data.data.find((currency) => currency.id == id);
  }, [editCurrencyModal, viewCurrencyModal, data?.data]);

  const handleCreateCurrency = useCallback(
    () => openModal("create"),
    [openModal]
  );

  const handleEditCurrency = useCallback(
    (currency: Currency) => {
      openModal<string | number>("edit", currency.id);
    },
    [openModal]
  );

  const handleViewCurrency = useCallback(
    (currency: Currency) => {
      openModal<string | number>("view", currency.id);
    },
    [openModal]
  );

  const handleToggleCurrencyStatus = useCallback(
    async (currency: Currency) => {
      if (currency.default) {
        showToast("No se puede desactivar la moneda por defecto", "error");
        return;
      }

      const action = currency.active ? "desactivar" : "activar";
      const actionPast = currency.active ? "desactivada" : "activada";

      try {
        const res = await deleteCurrency(currency.id);

        if (res?.error) {
          showToast(`Error al ${action} moneda`, "error");
        } else {
          queryClient.invalidateQueries({ queryKey: ["currencies"] });
          showToast(`Moneda ${actionPast} correctamente`, "success");
        }
      } catch (error) {
        console.error(error);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    [queryClient]
  );

  const handleSetAsDefault = useCallback(
    async (currency: Currency) => {
      if (currency.default) {
        showToast("Esta moneda ya es la predeterminada", "info");
        return;
      }

      try {
        const res = await setAsDefaultCurrency(currency.id);

        if (res?.error) {
          showToast("Error al establecer moneda por defecto", "error");
        } else {
          queryClient.invalidateQueries({ queryKey: ["currencies"] });
          showToast("Moneda establecida como predeterminada", "success");
        }
      } catch (error) {
        console.error(error);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    [queryClient]
  );

  const columns = useMemo<DataTableColumn<Currency>[]>(
    () => [
      {
        accessor: "id",
        title: "ID",
        sortable: true,
        width: 80,
        render: (currency) => (
          <span className="font-medium text-dark dark:text-white">
            #{currency.id}
          </span>
        ),
      },
      {
        accessor: "name",
        title: "Moneda",
        sortable: true,
        width: 80,
        render: (currency) => (
          <div className="flex flex-col max-w-full">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate block">
              {currency.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate block">
              {currency.codIso}
            </span>
          </div>
        ),
      },
      {
        accessor: "symbol",
        title: "Símbolo",
        sortable: true,
        width: 100,
        render: (currency) => (
          <div className="text-center max-w-full">
            <span className="text-sm font-mono text-gray-800 dark:text-gray-200 truncate block">
              {currency.symbol}
            </span>
          </div>
        ),
      },
      {
        accessor: "rate",
        title: "Tasa de Cambio",
        sortable: true,
        width: 80,
        render: (currency) => (
          <div className="text-center max-w-full">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {currency.rate.toLocaleString("es-CO", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}
            </span>
          </div>
        ),
      },
      {
        accessor: "active",
        title: "Estado",
        sortable: true,
        width: 100,
        render: (currency) => (
          <div className="max-w-full">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                currency.active
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {currency.active ? "Activa" : "Inactiva"}
            </span>
          </div>
        ),
      },
      {
        accessor: "default",
        title: "Por Defecto",
        sortable: true,
        width: 120,
        render: (currency) => (
          <div className="text-center max-w-full">
            {currency.default ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 whitespace-nowrap">
                Sí
              </span>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                No
              </span>
            )}
          </div>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        width: 80,
        render: (currency) => (
          <div className="flex justify-center max-w-full">
            <ActionsMenu
              onViewDetails={() => handleViewCurrency(currency)}
              onEdit={() => handleEditCurrency(currency)}
              onPay={
                !currency.default && currency.active
                  ? () => handleSetAsDefault(currency)
                  : undefined
              }
              active={currency.active}
              onActive={
                !currency.default
                  ? () => handleToggleCurrencyStatus(currency)
                  : undefined
              }
              viewPermissions={[PERMISSION_ENUM.RETRIEVE]}
              editPermissions={[PERMISSION_ENUM.UPDATE]}
              payPermissions={[PERMISSION_ENUM.UPDATE]}
              activePermissions={[PERMISSION_ENUM.UPDATE]}
            />
          </div>
        ),
      },
    ],
    [
      handleViewCurrency,
      handleEditCurrency,
      handleSetAsDefault,
      handleToggleCurrencyStatus,
    ]
  );

  return (
    <>
      <DataGrid
        simpleData={data?.data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar monedas..."
        onCreate={handleCreateCurrency}
        createPermissions={[PERMISSION_ENUM.CREATE]}
        emptyText="No se encontraron monedas"
      />
      {/* Create Modal */}

      <CurrenciesModalContainer
        open={createCurrencyModal.open}
        onClose={() => closeModal("create")}
      />

      {/* Edit Modal */}
      {selectedCurrency && (
        <CurrenciesModalContainer
          onClose={() => closeModal("edit")}
          open={editCurrencyModal.open}
          currency={selectedCurrency}
        />
      )}
      {/* Details Modal */}
      {selectedCurrency && (
        <CurrenciesModalContainer
          onClose={() => closeModal("view")}
          open={viewCurrencyModal.open}
          currency={selectedCurrency}
          isDetailsView
        />
      )}
    </>
  );
}
