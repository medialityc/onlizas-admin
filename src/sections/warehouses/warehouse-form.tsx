'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createWarehouse, updateWarehouse } from '@/services/warehouses-mock';
import { Warehouse } from '@/types/warehouses';
import { Button } from '@/components/button/button';
import { paths } from '@/config/paths';
import FormProvider from '@/components/react-hook-form/form-provider';
import RHFInputWithLabel from '@/components/react-hook-form/rhf-input';
import RHFSelect from '@/components/react-hook-form/rhf-select';
import RHFCheckbox from '@/components/react-hook-form/rhf-checkbox';
import LoaderButton from '@/components/loaders/loader-button';

import {
  warehouseFormSchema,
  WarehouseFormValues,
  defaultWarehouseFormValues,
  transformToApiFormat
} from './warehouse-form/schema/warehouse-schema';

interface WarehouseFormProps {
  warehouse?: Warehouse;
  onSuccess?: () => void;
}

export function WarehouseForm ({ warehouse, onSuccess }: WarehouseFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const isEdit = Boolean(warehouse);

  // Función para convertir datos del warehouse a formato del formulario
  const warehouseToFormData = (warehouse: Warehouse): WarehouseFormValues => ({
    name: warehouse.name || '',
    type: warehouse.type || 'physical',
    status: warehouse.status || 'active',
    description: warehouse.description || '',
    maxCapacity: warehouse.maxCapacity,
    currentCapacity: warehouse.currentCapacity || 0,
    managerName: warehouse.managerName || '',
    managerEmail: warehouse.managerEmail || '',
    managerPhone: warehouse.managerPhone || '',
    locationId: warehouse.locationId || 1,
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    coordinates: undefined,
    virtualSubType: warehouse.virtualSubType || 'general',
    virtualRules: warehouse.virtualRules || {
      allowsManualInventory: true,
      requiresApprovalToExit: false,
      requiresInspection: false,
      allowsCrossDocking: true,
      priorityLevel: 'low',
      notificationRules: {
        notifyOnEntry: false,
        notifyOnExit: false,
        notifyBeforeExpiry: false,
        daysByforeExpiryAlert: 0,
      },
    },
    linkedPhysicalWarehouseId: warehouse.linkedPhysicalWarehouseId,
    supplierId: warehouse.supplierId,
  }); const methods = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseFormSchema) as any,
    defaultValues: warehouse ? warehouseToFormData(warehouse) : defaultWarehouseFormValues,
    mode: 'onChange',
  });

  const { watch } = methods;
  const watchedType = watch('type');

  const mutation = useMutation({
    mutationFn: (data: WarehouseFormValues) => {
      const transformedData = transformToApiFormat(data);
      return isEdit ? updateWarehouse(warehouse!.id, transformedData) : createWarehouse(transformedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      onSuccess?.();
    },
  });

  const onSubmit = (data: WarehouseFormValues) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    router.push(paths.dashboard.warehouses.list);
  };
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RHFInputWithLabel
            name="name"
            label="Nombre *"
            placeholder="Nombre del almacén"
            required
          />
          <RHFSelect
            name="type"
            label={`Tipo *${isEdit ? ' (no editable)' : ''}`}
            options={[
              { value: 'physical', label: 'Físico' },
              { value: 'virtual', label: 'Virtual' },
            ]}
            disabled={isEdit}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RHFSelect
            name="status"
            label="Estado *"
            options={[
              { value: 'active', label: 'Activo' },
              { value: 'inactive', label: 'Inactivo' },
              { value: 'maintenance', label: 'Mantenimiento' },
            ]}
            required
          />
          <RHFInputWithLabel
            name="locationId"
            label="ID Localización"
            type="number"
            placeholder="ID de ubicación"
          />
        </div>

        {watchedType === 'physical' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInputWithLabel
              name="maxCapacity"
              label="Capacidad Máx."
              type="number"
              placeholder="Capacidad máxima"
              min="0"
            />
            <RHFInputWithLabel
              name="currentCapacity"
              label="Capacidad Actual"
              type="number"
              placeholder="Capacidad actual"
              min="0"
            />
          </div>
        )}

        {watchedType === 'virtual' && (
          <div className="space-y-4">
            <RHFSelect
              name="virtualSubType"
              label="Subtipo Virtual"
              options={[
                { value: 'in_transit', label: 'En Tránsito' },
                { value: 'inspection', label: 'Inspección' },
                { value: 'repair', label: 'Reparación' },
                { value: 'customer_reserved', label: 'Reservado Cliente' },
                { value: 'damaged_goods', label: 'Mercancía Dañada' },
                { value: 'quarantine', label: 'Cuarentena' },
                { value: 'staging', label: 'Preparación' },
                { value: 'returns', label: 'Devoluciones' },
                { value: 'supplier_managed', label: 'Gestionado por Proveedor' },
                { value: 'general', label: 'General' },
              ]}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RHFInputWithLabel
                name="linkedPhysicalWarehouseId"
                label="Almacén Físico Vinculado"
                type="number"
                placeholder="ID del almacén físico"
              />
              <RHFInputWithLabel
                name="supplierId"
                label="ID Proveedor"
                type="number"
                placeholder="ID del proveedor"
              />
            </div>
          </div>
        )}

        {/* Información del gestor */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Información del Gestor</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RHFInputWithLabel
              name="managerName"
              label="Nombre del Gestor"
              placeholder="Nombre completo"
            />
            <RHFInputWithLabel
              name="managerEmail"
              label="Email del Gestor"
              type="email"
              placeholder="email@ejemplo.com"
            />
            <RHFInputWithLabel
              name="managerPhone"
              label="Teléfono del Gestor"
              type="tel"
              placeholder="+1234567890"
            />
          </div>
        </div>

        <RHFInputWithLabel
          name="description"
          label="Descripción"
          type="textarea"
          placeholder="Descripción del almacén"
          rows={3}
        />        <div className="flex gap-3 pt-2">
          <LoaderButton
            type="submit"
            loading={mutation.isPending}
          >
            {isEdit ? 'Actualizar' : 'Crear'} Almacén
          </LoaderButton>
          <Button
            type="button"
            variant="secondary"
            outline
            onClick={handleCancel}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
