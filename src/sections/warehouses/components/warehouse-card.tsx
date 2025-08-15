'use client';

import { Warehouse } from '@/types/warehouses';
import Badge from '@/components/badge/badge';
import { useRouter } from 'next/navigation';
import { paths } from '@/config/paths';
import clsx from 'clsx';
import { BuildingOfficeIcon, BuildingStorefrontIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';

interface WarehouseCardProps {
  warehouse: Warehouse;
  onEdit?: (warehouse: Warehouse) => void;
  onDelete?: (warehouse: Warehouse) => void;
}

export function WarehouseCard ({ warehouse, onEdit, onDelete }: WarehouseCardProps) {
  const router = useRouter();

  const handleView = () => router.push(paths.dashboard.warehouses.view(warehouse.id));
  const handleEdit = () => router.push(paths.dashboard.warehouses.edit(warehouse.id));

  const getTypeIcon = () => {
    return warehouse.type === 'physical' ? BuildingStorefrontIcon : BuildingOfficeIcon;
  };

  const getStatusColor = () => {
    switch (warehouse.status) {
      case 'active': return 'badge-outline-success';
      case 'maintenance': return 'badge-outline-warning';
      default: return 'badge-outline-secondary';
    }
  };

  const getStatusText = () => {
    switch (warehouse.status) {
      case 'active': return 'Activo';
      case 'maintenance': return 'Mantenimiento';
      default: return 'Inactivo';
    }
  };

  const getSupplierCount = () => {
    // Simular diferentes cantidades de proveedores basados en el tipo de almacén
    if (warehouse.type === 'physical') {
      return warehouse.id === 1 ? 15 : warehouse.id === 2 ? 8 : 5;
    }
    return 1; // Almacenes virtuales generalmente tienen 1 proveedor
  };
  const TypeIcon = getTypeIcon();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex gap-4 flex-col shadow-sm hover:shadow-md dark:hover:shadow-gray-900/20 transition-shadow">
      {/* Header con icono y estado */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={clsx(
            'p-3 rounded-lg',
            warehouse.type === 'physical'
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
          )}>
            <TypeIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary cursor-pointer" onClick={handleView}>
              {warehouse.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{warehouse.description}</p>
          </div>
        </div>
        <Badge className={clsx(getStatusColor(), 'text-xs')}>{getStatusText()}</Badge>
      </div>

      {/* Body - contenido que crece */}
      <div className="flex-grow space-y-4">        {/* Dirección */}
        {warehouse.location?.address && (
          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPinIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <div>{warehouse.location.address}</div>
              <div className="text-gray-500 dark:text-gray-500">{warehouse.location.region}, {warehouse.location.country}</div>
            </div>
          </div>
        )}

        {/* Métricas en grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Capacidad */}
          {warehouse.maxCapacity && (<div>
            <div className="flex items-center gap-2 justify-between mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Capacidad</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{warehouse.currentCapacity || 0} / {warehouse.maxCapacity}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={clsx(
                  'h-2 rounded-full transition-all',
                  (warehouse.occupancyPercentage || 0) >= 90 ? 'bg-red-500' :
                    (warehouse.occupancyPercentage || 0) >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                )}
                style={{ width: `${Math.min(warehouse.occupancyPercentage || 0, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{warehouse.occupancyPercentage || 0}% ocupado</div>
          </div>
          )}          {/* Proveedores */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Proveedores</span>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">{getSupplierCount()}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {warehouse.managerName || 'Gestor: No asignado'}
            </div>
          </div>
        </div>
      </div>      {/* Botones de acción - siempre al final */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <button
          className="flex-1 py-2 px-3 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          onClick={handleEdit}
        >
          Editar
        </button>
        <button
          className="flex-1 py-2 px-3 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          onClick={handleView}
        >
          Detalles
        </button>
      </div>
    </div>
  );
}
