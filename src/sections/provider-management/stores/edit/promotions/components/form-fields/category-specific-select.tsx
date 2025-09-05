import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getStoreCategoriesForSelect } from "@/services/store-categories";

interface Props {
  name: string;
  storeId: number;
  label?: string;
}

/**
 * CategorySpecificSelect adapts the existing infinite autofetcher to call
 * getStoreCategoriesForSelect which internally returns all categories and
 * simulates pagination. We force a large pageSize so the UI behaves as a non-paginated
 * select while reusing the existing component.
 */
export default function CategorySpecificSelect({ name, storeId, label }: Props) {
  return (
    <RHFAutocompleteFetcherInfinity
      name={name}
      label={label}
      placeholder="Buscar categorías específicas..."
      onFetch={(params) => getStoreCategoriesForSelect(storeId, { ...params, pageSize: 1000 })}
      objectValueKey="id"
      objectKeyLabel="categoryName"
      multiple={true}
      queryKey={`store-categories-${storeId}`}
    />
  );
}
