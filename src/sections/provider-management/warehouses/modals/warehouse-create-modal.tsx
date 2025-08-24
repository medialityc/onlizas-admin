'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWarehouse, updateWarehouse } from '@/services/warehouses-mock';
import { Warehouse } from '@/types/warehouses';
import { Button } from '@/components/button/button';
import SimpleModal from '@/components/modal/modal';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import RHFInput from '@/components/react-hook-form/rhf-input';
import RHFSelect from '@/components/react-hook-form/rhf-select';
import RHFAutocompleteFetcherInfinity from '@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity';
import { getAllSuppliers } from '@/services/supplier';

// Schema simplificado para el modal de creación
const createWarehouseSchema = z.object({
  type: z.enum(['physical', 'virtual']),
  name: z.string().min(1, 'El nombre del almacén es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  supplierId: z.number().optional(),
}).refine((data) => {
  // Para almacenes virtuales, el proveedor es obligatorio
  if (data.type === 'virtual') {
    return data.supplierId !== undefined;
  }
  return true;
}, {
  message: "Para almacenes virtuales, debe seleccionar un proveedor",
  path: ["supplierId"]
});

type CreateWarehouseValues = z.infer<typeof createWarehouseSchema>;

const defaultCreateValues: CreateWarehouseValues = {
  type: 'physical',
  name: '',
  address: '',
  supplierId: undefined,
};

interface WarehouseCreateModalProps {
  open: boolean;
  onClose: () => void;
  warehouse?: Warehouse;
}

export function WarehouseCreateModal ({ open, onClose, warehouse }: WarehouseCreateModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!warehouse;

  // Valores por defecto dinámicos basados en warehouse
  const getDefaultValues = (): CreateWarehouseValues => {
    if (warehouse) {
      return {
        name: warehouse.name,
        type: warehouse.type,
        address: warehouse.location?.address || '',
        supplierId: warehouse.supplierId,
      };
    }
    return defaultCreateValues;
  };

  const methods = useForm({
    resolver: zodResolver(createWarehouseSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange',
  });

  const { handleSubmit, reset, watch } = methods;
  const watchedType = watch('type');

  const mutation = useMutation({
    mutationFn: async (data: CreateWarehouseValues) => {
      // Transformar datos básicos al formato completo de la API
      const apiData = {
        name: data.name,
        type: data.type,
        status: 'active' as const,
        description: '',
        locationId: 1, // ID temporal
        address: data.address,
        city: '',
        state: '',
        country: 'México',
        postalCode: '',
        managerName: '',
        managerEmail: '',
        managerPhone: '',
        ...(data.type === 'physical' && {
          maxCapacity: 1000, // Capacidad por defecto
          currentCapacity: 0,
        }),
        ...(data.type === 'virtual' && {
          virtualSubType: 'supplier_managed' as const,
          supplierId: data.supplierId,
          virtualRules: {
            allowsManualInventory: true,
            requiresApprovalToExit: false,
            requiresInspection: false,
            allowsCrossDocking: true,
            priorityLevel: 'low' as const,
            notificationRules: {
              notifyOnEntry: false,
              notifyOnExit: false,
              notifyBeforeExpiry: false,
              daysByforeExpiryAlert: 0,
            },
          },
        }),
      };

      if (isEdit && warehouse) {
        return updateWarehouse(warehouse.id, apiData);
      } else {
        return createWarehouse(apiData);
      }
    }, onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      reset(defaultCreateValues);
      onClose();
    },
  });

  const onSubmit = (data: CreateWarehouseValues) => {
    mutation.mutate(data);
  };

  return (
    <SimpleModal
      key={warehouse?.id || 'new'} // Key para reiniciar el form cuando cambia warehouse
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar Almacén' : 'Nuevo Almacén'}
    >
      <FormProvider {...methods}>        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Información básica */}
        <div className="space-y-4">
          <RHFSelect
            name="type"
            label="Tipo de Almacén"
            options={[
              { value: 'physical', label: 'Físico' },
              { value: 'virtual', label: 'Virtual' },
            ]}
          />

          <RHFInput
            name="name"
            label="Nombre del Almacén"
            placeholder="Ej: Almacén Central Norte"
            required
          />

          <RHFInput
            name="address"
            label="Dirección"
            placeholder="Ej: Av. Industrial 123, Colonia Centro"
            required
          />
        </div>

        {/* Proveedor para almacenes virtuales */}
        {watchedType === 'virtual' && (
          <RHFAutocompleteFetcherInfinity
            name="supplierId"
            label="Proveedor"
            placeholder="Seleccionar proveedor..."
            onFetch={getAllSuppliers}
            objectValueKey="id"
            objectKeyLabel="name"
            queryKey="suppliers"
            required
          />
        )}          {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            outline
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')} Almacén
          </Button>
        </div>
      </form>
      </FormProvider>
    </SimpleModal>
  );
}
