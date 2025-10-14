import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import {  getAllProductsBySupplier } from "@/services/products";

interface ProductSelectProps {
  name: string;
  storeId: number;
  label?: string;
  multiple:boolean,
}

export default function ProductSelect({ name, multiple,storeId, label }: ProductSelectProps) {
  return (
    <RHFAutocompleteFetcherInfinity
      name={name}
      label={label}
      placeholder="Buscar productos..."
      onFetch={(params) => getAllProductsBySupplier('1', params)}
      objectValueKey="id"
      objectKeyLabel="name"
      multiple={multiple}
      queryKey="products-promotion"
    />
  );
}
