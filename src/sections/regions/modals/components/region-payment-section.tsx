"use client";

import { useState } from "react";
import { Region } from "@/types/regions";
import { Badge } from "@mantine/core";
import { 
  ArrowUpIcon,
  ArrowDownIcon,
  TrashIcon,
  PencilIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { 
  removePaymentGatewayFromRegion, 
  updatePaymentGatewayPriority 
} from "@/services/regions";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import DeleteDialog from "@/components/modal/delete-modal";
import EditPaymentModal from "../edit/edit-payment-modal";

interface RegionPaymentSectionProps {
  region: Region;
  canEdit?: boolean;
  canDelete?: boolean;
  onOpenConfig?: (type: 'payments') => void;
}

export default function RegionPaymentSection({ 
  region, 
  canEdit = false,
  canDelete = false,
  onOpenConfig
}: RegionPaymentSectionProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    paymentGatewayId: number |string| null;
    paymentGatewayName: string;
  }>({
    open: false,
    paymentGatewayId: null,
    paymentGatewayName: ""
  });

  const [editModal, setEditModal] = useState<{
    open: boolean;
    paymentGateway: any | null;
  }>({
    open: false,
    paymentGateway: null
  });

  const queryClient = useQueryClient();

  if (!region.paymentConfig) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="font-medium text-lg mb-3">Configuración de Pagos</h3>
        <p className="text-gray-500 dark:text-gray-400">No hay pasarelas de pago configuradas</p>
      </div>
    );
  }

  const { gateways, enabledCount, totalCount } = region.paymentConfig;

  const handleChangePriority = async (paymentGatewayId: number|string, direction: "increase" | "decrease", paymentGatewayName: string) => {
    if (!canEdit) return;
    
    const currentGateway = gateways?.find(g => g.paymentGatewayId === paymentGatewayId);
    if (!currentGateway) return;
    
    const newPriority = direction === "increase" 
      ? (currentGateway.priority || 0) + 1 
      : Math.max((currentGateway.priority || 0) - 1, 1);
    
    try {
      const response = await updatePaymentGatewayPriority(region.id, paymentGatewayId, {
        paymentGatewayId,
        newPriority
      });
      if (!response.error) {
        toast.success(`Prioridad de ${paymentGatewayName} actualizada`);
        queryClient.invalidateQueries({ queryKey: ["regions"] });
        queryClient.invalidateQueries({ queryKey: ["region-details", region.id] });
      } else {
        toast.error(response.message || "Error al actualizar prioridad");
      }
    } catch (error) {
      toast.error("Error al actualizar prioridad");
    }
  };

  const handleDeletePaymentGateway = async () => {
    if (!deleteDialog.paymentGatewayId || !canDelete) return;

    try {
      const response = await removePaymentGatewayFromRegion(region.id, deleteDialog.paymentGatewayId);
      if (!response.error) {
        toast.success("Pasarela de pago eliminada exitosamente");
        queryClient.invalidateQueries({ queryKey: ["regions"] });
        queryClient.invalidateQueries({ queryKey: ["region-details", region.id] });
        closeDeleteDialog();
      } else {
        toast.error(response.message || "Error al eliminar pasarela de pago");
      }
    } catch (error) {
      toast.error("Error al eliminar pasarela de pago");
    }
  };

  const openDeleteDialog = (paymentGatewayId: number|string, paymentGatewayName: string) => {
    setDeleteDialog({
      open: true,
      paymentGatewayId,
      paymentGatewayName
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      paymentGatewayId: null,
      paymentGatewayName: ""
    });
  };

  const openEditModal = (paymentGateway: any) => {
    setEditModal({
      open: true,
      paymentGateway
    });
  };

  const closeEditModal = () => {
    setEditModal({
      open: false,
      paymentGateway: null
    });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-lg">Configuración de Pagos</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {enabledCount} de {totalCount} pasarelas habilitadas
            </p>
          </div>
          {canEdit && (
            <button
              type="button"
              onClick={() => onOpenConfig?.('payments')}
              className="btn btn-primary btn-sm"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Agregar Pasarelas
            </button>
          )}
        </div>

        {/* Lista de pasarelas de pago */}
        {gateways && gateways.length > 0 ? (
          <div className="space-y-2">
            {gateways
              .sort((a, b) => (a.priority || 0) - (b.priority || 0))
              .map((gateway) => (
                <div
                  key={gateway.paymentGatewayId}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {gateway.name} ({gateway.code})
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Prioridad: {gateway.priority} | Métodos: {gateway.supportedMethods?.join(', ') || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge 
                      color={gateway.isEnabled ? "green" : "gray"}
                      variant="light"
                    >
                      {gateway.isEnabled ? "Habilitada" : "Deshabilitada"}
                    </Badge>
                    
                    {gateway.isFallback && (
                      <Badge color="blue" variant="light">
                        Respaldo
                      </Badge>
                    )}

                    {/* Botones de acción */}
                    <div className="flex items-center space-x-1">
                      {canEdit && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleChangePriority(gateway.paymentGatewayId, "increase", gateway.name)}
                            className="p-2 rounded-md text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                            title="Aumentar prioridad"
                          >
                            <ArrowUpIcon className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleChangePriority(gateway.paymentGatewayId, "decrease", gateway.name)}
                            className="p-2 rounded-md text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                            title="Disminuir prioridad"
                          >
                            <ArrowDownIcon className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(gateway)}
                            className="p-2 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            title="Editar configuración"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => openDeleteDialog(gateway.paymentGatewayId, gateway.name)}
                          className="p-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Eliminar pasarela"
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
            No hay pasarelas de pago configuradas
          </div>
        )}
      </div>

      {/* Dialog de confirmación para eliminar */}
      <DeleteDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={handleDeletePaymentGateway}
        title="Eliminar Pasarela de Pago"
        description={`¿Estás seguro de que deseas eliminar la pasarela "${deleteDialog.paymentGatewayName}" de esta región?`}
      />

      {/* Modal de edición */}
      <EditPaymentModal
        open={editModal.open}
        onClose={closeEditModal}
        paymentGateway={editModal.paymentGateway}
        regionId={region.id}
        
      />
    </>
  );
}