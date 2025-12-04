import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllProducts, getAllProductsBySupplier, getAllProductsVariants } from "@/services/products";
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
      return getAllProductsVariants( params); // false = isProvider
    }
  };

  return (
    <RHFAutocompleteFetcherInfinity
      name={name}
      label={label}
      placeholder="Buscar productos..."
      onFetch={fetchProducts}
      objectValueKey="id"
      objectKeyLabel="productName"
      multiple={multiple}
      queryKey="products-promotion"
    />
  );
}
