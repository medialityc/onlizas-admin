import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import {
  getAllInventory,
  getAllInventoryByUserProvider,
} from "@/services/inventory-providers";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface InventorySelectProps {
  name: string;
  storeId: string;
  supplierId: string;
  label?: string;
  multiple: boolean;
}

export default function InventorySelect({
  name,
  multiple,
  storeId,
  supplierId,
  label,
}: InventorySelectProps) {
  const { hasPermission } = usePermissions();

  // No llamar la API si supplierId no está disponible
  if (!supplierId) {
    return (
      <div className="space-y-2">
        {label && <label className="text-sm font-medium">{label}</label>}
        <div className="p-3 border border-gray-300 rounded text-center text-gray-500">
          Cargando información...
        </div>
      </div>
    );
  }

  // Función que detecta permisos y usa el endpoint apropiado
  const fetchInventory = (params: any) => {
    const isAdmin = hasPermission([
      PERMISSION_ENUM.CREATE,
      PERMISSION_ENUM.UPDATE,
    ]);
    if (isAdmin) {
      console.log("entro");
      return getAllInventory(params);
    } else {
      return getAllInventoryByUserProvider(supplierId, params);
    }
  };

  return (
    <RHFAutocompleteFetcherInfinity
      name={name}
      label={label}
      placeholder="Buscar items de inventario..."
      onFetch={fetchInventory}
      objectValueKey="id"
      objectKeyLabel="parentProductName"
      multiple={multiple}
      queryKey={`inventory-promotion-${supplierId}`}
    />
  );
}
