import React from 'react';
import { VIRTUAL_WAREHOUSE_SUBTYPES, VIRTUAL_SUBTYPE_OPTIONS } from '@/data/werehouses/virtual-warehouses';
import { VirtualWarehouseIcon } from '@/components/warehouses/virtual-warehouse-icon';

// Ejemplo de uso de los iconos tipados para almacenes virtuales

export const VirtualWarehouseSubtypeSelector: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <h3 className="col-span-2 text-lg font-semibold mb-4">
        Tipos de Almacenes Virtuales
      </h3>

      {VIRTUAL_SUBTYPE_OPTIONS.map((subtype) => (
        <div
          key={subtype.id}
          className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <VirtualWarehouseIcon
            IconComponent={subtype.icon}
            size="md"
            className="text-blue-600"
          />
          <div>
            <h4 className="font-medium text-sm">{subtype.name}</h4>
            <p className="text-xs text-gray-500">{subtype.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Ejemplo de uso individual
export const SingleVirtualWarehouseIcon: React.FC<{ subtypeId: string }> = ({ subtypeId }) => {
  const subtype = VIRTUAL_WAREHOUSE_SUBTYPES[subtypeId];

  if (!subtype) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <VirtualWarehouseIcon
        IconComponent={subtype.icon}
        size="sm"
        className="text-gray-700"
      />
      <span className="text-sm">{subtype.name}</span>
    </div>
  );
};

export default VirtualWarehouseSubtypeSelector;
