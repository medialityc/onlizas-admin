'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Warehouse } from '@/types/warehouses';
import { deleteWarehouse, updateWarehouse } from '@/services/warehouses-mock';
import SimpleModal from '@/components/modal/modal';
import { Button } from '@/components/button/button';
import InputWithLabel from '@/components/input/input-with-label';
import showToast from '@/config/toast/toastConfig';

interface WarehouseDeleteModalProps {
  open: boolean;
  onClose: () => void;
  warehouse: Warehouse | null;
}

export function WarehouseDeleteModal ({ open, onClose, warehouse }: WarehouseDeleteModalProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [reason, setReason] = useState('');

  // Validación frontend basada en permisos del backend (BFF)
  const canDelete = warehouse?.permissions?.canDelete ?? false;
  const canDeactivate = warehouse?.permissions?.canDeactivate ?? false;
  const hasInventory = warehouse?.hasActiveInventory ?? ((warehouse?.currentCapacity || 0) > 0);

  const deleteMutation = useMutation({
    mutationFn: () => deleteWarehouse(warehouse!.id, { reason }),
    onSuccess: (response) => {
      if (response.error) {
        if (response.status === 409) {
          showToast('No se puede eliminar: el almacén tiene inventario activo.', 'warning');
        } else {
          showToast(response.message || 'Error al eliminar el almacén.', 'error');
        }
        return;
      }
      showToast('Almacén eliminado correctamente (lógico).', 'success');
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      handleClose();
      router.refresh();
    },
    onError: () => {
      showToast('Ocurrió un error inesperado.', 'error');
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: () => updateWarehouse(warehouse!.id, { status: 'inactive' }, { reason }),
    onSuccess: (response) => {
      if (response.error) {
        showToast(response.message || 'Error al desactivar el almacén.', 'error');
        return;
      }
      showToast('Almacén desactivado correctamente.', 'success');
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      handleClose();
      router.refresh();
    },
    onError: () => {
      showToast('Ocurrió un error inesperado.', 'error');
    },
  });
  const handleConfirmDelete = () => {
    if (!warehouse || !canDelete || hasInventory) return;
    deleteMutation.mutate();
  };

  const handleConfirmDeactivate = () => {
    if (!warehouse || !canDeactivate) return;
    deactivateMutation.mutate();
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  if (!warehouse) return null;

  // Determinar el título y mensaje basado en permisos
  const getModalTitle = () => {
    if (!canDelete && !canDeactivate) return 'Sin Permisos';
    if (hasInventory || !canDelete) return 'Desactivar Almacén';
    return 'Eliminar o Desactivar Almacén';
  };

  const getModalMessage = () => {
    if (!canDelete && !canDeactivate) {
      return `No tiene permisos para realizar acciones en el almacén "${warehouse.name}".`;
    }
    if (hasInventory || !canDelete) {
      return `El almacén "${warehouse.name}" ${hasInventory ? 'tiene inventario y' : ''} no puede ser eliminado. Puede desactivarlo para prevenir nuevas operaciones.`;
    }
    return `¿Estás seguro de que quieres eliminar el almacén "${warehouse.name}"? Esta acción es un borrado lógico y puede ser revertido por un administrador. Como alternativa, puedes desactivarlo.`;
  };
  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      title={getModalTitle()}
    >
      <div className="space-y-4">
        <p>{getModalMessage()}</p>

        {(canDelete || canDeactivate) && (
          <InputWithLabel
            id="reason"
            name="reason"
            label="Motivo (opcional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej: Cierre de operaciones en la zona."
          />
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            outline
            onClick={handleClose}
          >
            Cancelar
          </Button>          {canDeactivate && (
            <Button
              type="button"
              variant="warning"
              onClick={handleConfirmDeactivate}
              disabled={deactivateMutation.isPending}
            >
              {deactivateMutation.isPending ? 'Desactivando...' : 'Desactivar'}
            </Button>
          )}

          {canDelete && !hasInventory && (
            <Button
              type="button"
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </Button>
          )}
        </div>
      </div>
    </SimpleModal>
  );
}
