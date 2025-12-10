import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import {
  getAllProducts,
  getAllProductsBySupplier,
  getAllProductsVariants,
} from "@/services/products";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface ProductSelectProps {
  name: string;
  storeId: string;
  supplierId: string;
  label?: string;
  multiple: boolean;
}

export default function ProductSelect({
  name,
  multiple,
  storeId,
  supplierId,
  label,
}: ProductSelectProps) {
  const { hasPermission } = usePermissions();

  // Función que detecta permisos y usa el endpoint apropiado
  const fetchProducts = (params: any) => {
    const isAdmin = hasPermission([
      PERMISSION_ENUM.CREATE,
      PERMISSION_ENUM.UPDATE,
    ]);

    if (isAdmin) {
      // Para admin, usar endpoint de admin
      return getAllProductsVariants(params); // true = isAdmin
    } else {
      // Para provider, usar endpoint normal
      return getAllProductsVariants(params); // false = isProvider
    }
  };

  // Función para mostrar información adicional de la variante
  const renderVariantOption = (option: any) => {
    const details = option.details || {};
    const detailsArray = Object.entries(details)
      .filter(([_, value]) => value && String(value).trim() !== "")
      .map(([key, value]) => `${key}: ${value}`);

    const detailsText =
      detailsArray.length > 0 ? ` (${detailsArray.join(", ")})` : "";

    return (
      <div className="flex flex-col">
        <span className="font-medium">{option.productName}</span>
        <span className="text-xs text-gray-500">{detailsText}</span>
      </div>
    );
  };

  return (
    <RHFAutocompleteFetcherInfinity
      name={name}
      label={label}
      placeholder="Buscar productos..."
      onFetch={fetchProducts}
      objectValueKey="inventoryId"
      objectKeyLabel="productName"
      renderOption={renderVariantOption}
      multiple={multiple}
      queryKey="products-promotion"
    />
  );
}
