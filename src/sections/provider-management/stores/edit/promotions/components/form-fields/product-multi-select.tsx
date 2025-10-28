import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import {  getAllProducts, getAllProductsBySupplier } from "@/services/products";

interface ProductSelectProps {
  name: string;
  storeId: string; // Cambiado a string para GUIDs
  label?: string;
  multiple:boolean,
}

export default function ProductSelect({ name, multiple,storeId, label }: ProductSelectProps) {
  return (
    <RHFAutocompleteFetcherInfinity
      name={name}
      label={label}
      placeholder="Buscar productos..."
      onFetch={(params) => getAllProducts( params)}
      objectValueKey="id"
      objectKeyLabel="name"
      multiple={multiple}
      queryKey="products-promotion"
    />
  );
}
