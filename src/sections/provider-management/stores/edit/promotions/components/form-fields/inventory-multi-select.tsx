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

  // Función para mostrar información adicional del inventario
  const renderInventoryOption = (option: any) => {
    //console.log(option)
    const supplierText = option.supplierName
      ? `Proveedor: ${option.supplierName}`
      : "";
    const warehouseText = option.warehouseName
      ? `Almacén: ${option.warehouseName}`
      : "";
    const store = option.storeName ? `Tienda: ${option.storeName}` : "";
    const priceText = option.totalPrice ? `Precio: $${option.totalPrice}` : "";
    const products = option.products.length
      ? `Productos: ${option.products.length}`
      : "0";

    const details = [supplierText, warehouseText, store, products, priceText]
      .filter(Boolean)
      .join(" • ");

    return (
      <div className="flex flex-col">
        <span className="font-medium">{option.parentProductName}</span>
        <span className="text-xs text-gray-500">{details}</span>
      </div>
    );
  };

  return (
    <RHFAutocompleteFetcherInfinity
      name={name}
      label={label}
      placeholder="Buscar items de inventario..."
      onFetch={fetchInventory}
      objectValueKey="id"
      objectKeyLabel="parentProductName"
      renderOption={renderInventoryOption}
      multiple={multiple}
      queryKey={`inventory-promotion-${supplierId}`}
    />
  );
}
