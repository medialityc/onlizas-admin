"use client";

import { useState } from "react";
import { Region } from "@/types/regions";
import { Badge } from "@mantine/core";
import { TrashIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { removeShippingMethodFromRegion } from "@/services/regions";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import DeleteDialog from "@/components/modal/delete-modal";
import EditShippingModal from '../edit/edit-shipping-modal-new';



interface RegionShippingSectionProps {
  region: Region;
  canEdit?: boolean;
  canDelete?: boolean;
  onOpenConfig?: (type: 'shipping') => void;
}

export default function RegionShippingSection({ 
  region, 
  canEdit = false,
  canDelete = false,
  onOpenConfig
}: RegionShippingSectionProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    shippingMethodId: number | null;
    shippingMethodName: string;
  }>({
    open: false,
    shippingMethodId: null,
    shippingMethodName: ""
  });

  const [editModal, setEditModal] = useState<{
    open: boolean;
    shippingMethod: any | null;
  }>({
    open: false,
    shippingMethod: null
  });

  const queryClient = useQueryClient();

  if (!region.shippingConfig) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="font-medium text-lg mb-3">Configuración de Envíos</h3>
        <p className="text-gray-500 dark:text-gray-400">No hay métodos de envío configurados</p>
      </div>
    );
  }

  const { methods, enabledCount, totalCount, minBaseCost, maxBaseCost } = region.shippingConfig;

  const handleDeleteShippingMethod = async () => {
    if (!deleteDialog.shippingMethodId || !canDelete) return;

    try {
      const response = await removeShippingMethodFromRegion(region.id, deleteDialog.shippingMethodId);
      if (!response.error) {
        toast.success("Método de envío eliminado exitosamente");
        queryClient.invalidateQueries({ queryKey: ["regions"] });
        closeDeleteDialog();
      } else {
        toast.error(response.message || "Error al eliminar método de envío");
      }
    } catch (error) {
      toast.error("Error al eliminar método de envío");
    }
  };

  const openDeleteDialog = (shippingMethodId: number, shippingMethodName: string) => {
    setDeleteDialog({
      open: true,
      shippingMethodId,
      shippingMethodName
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      shippingMethodId: null,
      shippingMethodName: ""
    });
  };

  const openEditModal = (shippingMethod: any) => {
    setEditModal({
      open: true,
      shippingMethod
    });
  };

  const closeEditModal = () => {
    setEditModal({
      open: false,
      shippingMethod: null
    });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-lg">Configuración de Envíos</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {enabledCount} de {totalCount} métodos habilitados
            </p>
          </div>
          {canEdit && (
            <button
              type="button"
              onClick={() => onOpenConfig?.('shipping')}
              className="btn btn-primary btn-sm"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Agregar Métodos
            </button>
          )}
        </div>

        {/* Resumen de costos */}
        {(minBaseCost !== undefined && minBaseCost !== null && maxBaseCost !== undefined && maxBaseCost !== null) && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <span className="text-xs text-blue-600 dark:text-blue-400">Costo Mínimo</span>
              <p className="text-lg font-medium text-blue-900 dark:text-blue-100">${minBaseCost.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <span className="text-xs text-green-600 dark:text-green-400">Costo Máximo</span>
              <p className="text-lg font-medium text-green-900 dark:text-green-100">${maxBaseCost.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Lista de métodos de envío */}
        {methods && methods.length > 0 ? (
          <div className="space-y-2">
            {methods.map((method) => (
              <div
                key={method.shippingMethodId}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {method.name} ({method.code})
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Transportista: {method.carrier} | Costo: ${method.baseCost?.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Tiempo estimado: {method.estimatedDaysMin}-{method.estimatedDaysMax} días
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge 
                    color={method.isEnabled ? "green" : "gray"}
                    variant="light"
                  >
                    {method.isEnabled ? "Habilitado" : "Deshabilitado"}
                  </Badge>

                  {/* Botones de acción */}
                  <div className="flex items-center space-x-1">
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => openEditModal(method)}
                        className="p-2 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="Editar configuración"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    )}
                    
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => openDeleteDialog(method.shippingMethodId, method.name)}
                        className="p-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Eliminar método de envío"
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
            No hay métodos de envío configurados
          </div>
        )}
      </div>

      {/* Dialog de confirmación para eliminar */}
      <DeleteDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteShippingMethod}
        title="Eliminar Método de Envío"
        description={`¿Estás seguro de que deseas eliminar el método "${deleteDialog.shippingMethodName}" de esta región?`}
      />

      {/* Modal de edición */}
      <EditShippingModal
        open={editModal.open}
        onClose={closeEditModal}
        shippingMethod={editModal.shippingMethod}
        regionId={region.id}
      />
    </>
  );
}