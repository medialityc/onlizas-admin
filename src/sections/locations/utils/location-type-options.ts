import { LocationType } from "@/types/locations";

export const LOCATION_TYPE_OPTIONS = [
  { value: LocationType.WAREHOUSE, label: "Almacén" },
  { value: LocationType.STORE, label: "Tienda" },
  { value: LocationType.DISTRIBUTION_CENTER, label: "Centro de distribución" },
  { value: LocationType.PICKUP_POINT, label: "Punto de recogida" },
  { value: LocationType.OFFICE, label: "Oficina" },
  { value: LocationType.OTHER, label: "Otro" },
];