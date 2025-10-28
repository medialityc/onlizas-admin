import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import {  getAllProductsBySupplier } from "@/services/products";

interface ProductSelectProps {
  name: string;
  storeId: string;
  supplierId: string; // Nuevo prop para supplierId
  label?: string;
  multiple: boolean;
}

export default function ProductSelect({ name, multiple, storeId, supplierId, label }: ProductSelectProps) {
  return (
    <RHFAutocompleteFetcherInfinity
      name={name}
      label={label}
      placeholder="Buscar productos..."
      onFetch={(params) => getAllProductsBySupplier(supplierId, params)}
      objectValueKey="id"
      objectKeyLabel="name"
      multiple={multiple}
      queryKey="products-promotion"
    />
  );
}
