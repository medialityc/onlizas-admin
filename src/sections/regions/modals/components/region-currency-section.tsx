"use client";

import { useState } from "react";
import { Region } from "@/types/regions";
import { Badge } from "@mantine/core";
import { 
  StarIcon, 
  TrashIcon,
  PencilIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { 
  removeCurrencyFromRegion, 
  setPrimaryCurrency 
} from "@/services/regions";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import DeleteDialog from "@/components/modal/delete-modal";
import EditCurrencyModal from "../edit/edit-currency-modal";


interface RegionCurrencySectionProps {
  region: Region;
  canEdit?: boolean;
  canDelete?: boolean;
  onOpenConfig?: (type: 'currencies') => void;
}

export default function RegionCurrencySection({ 
  region, 
  canEdit = false,
  canDelete = false,
  onOpenConfig
}: RegionCurrencySectionProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    currencyId: number | null;
    currencyName: string;
  }>({
    open: false,
    currencyId: null,
    currencyName: ""
  });

  const [editModal, setEditModal] = useState<{
    open: boolean;
    currency: any | null;
  }>({
    open: false,
    currency: null
  });

  const queryClient = useQueryClient();

  if (!region.currencyConfig) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="font-medium text-lg mb-3">Configuración de Monedas</h3>
        <p className="text-gray-500 dark:text-gray-400">No hay monedas configuradas</p>
      </div>
    );
  }

  const { allCurrencies, enabledCount, totalCount } = region.currencyConfig;

  const handleSetPrimary = async (currencyId: number, currencyName: string) => {
    if (!canEdit) return;
    
    try {
      const response = await setPrimaryCurrency(region.id, currencyId);
      if (!response.error) {
        toast.success(`${currencyName} establecida como moneda primaria`);
        queryClient.invalidateQueries({ queryKey: ["regions"] });
      } else {
        toast.error(response.message || "Error al establecer moneda primaria");
      }
    } catch (error) {
      toast.error("Error al establecer moneda primaria");
    }
  };

  const handleDeleteCurrency = async () => {
    if (!deleteDialog.currencyId || !canDelete) return;

    try {
      const response = await removeCurrencyFromRegion(region.id, deleteDialog.currencyId);
      if (!response.error) {
        toast.success("Moneda eliminada exitosamente");
        queryClient.invalidateQueries({ queryKey: ["regions"] });
        closeDeleteDialog();
      } else {
        toast.error(response.message || "Error al eliminar moneda");
      }
    } catch (error) {
      toast.error("Error al eliminar moneda");
    }
  };

  const openDeleteDialog = (currencyId: number, currencyName: string) => {
    setDeleteDialog({
      open: true,
      currencyId,
      currencyName
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      currencyId: null,
      currencyName: ""
    });
  };

  const openEditModal = (currency: any) => {
    setEditModal({
      open: true,
      currency
    });
  };

  const closeEditModal = () => {
    setEditModal({
      open: false,
      currency: null
    });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-lg">Configuración de Monedas</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {enabledCount} de {totalCount} monedas habilitadas
            </p>
          </div>
          {canEdit && (
            <button
              type="button"
              onClick={() => onOpenConfig?.('currencies')}
              className="btn btn-primary btn-sm"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Agregar Monedas
            </button>
          )}
        </div>

        {/* Lista de todas las monedas */}
        {allCurrencies && allCurrencies.length > 0 ? (
          <div className="space-y-2">
            {allCurrencies.map((currency) => (
              <div
                key={currency.currencyId}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {currency.name} ({currency.code})
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Símbolo: {currency.symbol} | Tasa: {currency.rate}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge 
                    color={currency.isEnabled ? "green" : "gray"}
                    variant="light"
                  >
                    {currency.isEnabled ? "Habilitada" : "Deshabilitada"}
                  </Badge>
                  
                  {currency.isPrimary && (
                    <Badge color="blue" variant="light">
                      Principal
                    </Badge>
                  )}

                  {/* Botones de acción */}
                  <div className="flex items-center space-x-1">
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => openEditModal(currency)}
                        className="p-2 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="Editar configuración"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    )}
                    
                    {canEdit && !currency.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(currency.currencyId, currency.name)}
                        className="p-2 rounded-md text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                        title="Establecer como principal"
                      >
                        <StarIcon className="h-4 w-4" />
                      </button>
                    )}
                    
                    {canDelete && !currency.isPrimary && (
                      <button
                        type="button"
                        onClick={() => openDeleteDialog(currency.currencyId, currency.name)}
                        className="p-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Eliminar moneda"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            No hay monedas configuradas
          </div>
        )}
      </div>

      {/* Dialog de confirmación para eliminar */}
      <DeleteDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteCurrency}
        title="Eliminar Moneda"
        description={`¿Estás seguro de que deseas eliminar la moneda "${deleteDialog.currencyName}" de esta región?`}
      />

      {/* Modal de edición */}
      <EditCurrencyModal
        open={editModal.open}
        onClose={closeEditModal}
        currency={editModal.currency}
        regionId={region.id}
      />
    </>
  );
}