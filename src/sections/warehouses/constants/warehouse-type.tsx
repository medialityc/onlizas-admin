export enum WAREHOUSE_TYPE_ROUTE_ENUM {
  virtual = "virtual",
  physical = "physical",
}
export enum WAREHOUSE_TYPE_ENUM {
  VirtualWarehouse = "VirtualWarehouse",
  Warehouse = "Warehouse",
}

export const WAREHOUSE_TYPE_OPTIONS = [
  { value: WAREHOUSE_TYPE_ROUTE_ENUM.physical, label: "Físico" },
  { value: WAREHOUSE_TYPE_ROUTE_ENUM.virtual, label: "Virtual" },
];

export enum WAREHOUSE_VIRTUAL_SUBTYPE_ENUM {
  in_transit = "in_transit", // En tránsito (HU-011, HU-013)
  inspection = "inspection", // En proceso de inspección
  repair = "repair", // En reparación
  customer_reserved = "customer_reserved", // Reservado para clientes específicos
  damaged_goods = "damaged_goods", // Mercancía dañada
  quarantine = "quarantine", // En cuarentena
  staging = "staging", // Área de preparación/montaje
  returns = "returns", // Devoluciones pendientes
  supplier_managed = "supplier_managed", // Gestionado por proveedor (HU-023)
  general = "general", // Propósito general
}

export const WAREHOUSE_SUBTYPE_OPTIONS = [
  { value: WAREHOUSE_VIRTUAL_SUBTYPE_ENUM.in_transit, label: "En Tránsito" },
  { value: WAREHOUSE_VIRTUAL_SUBTYPE_ENUM.inspection, label: "Inspección" },
  { value: WAREHOUSE_VIRTUAL_SUBTYPE_ENUM.repair, label: "Reparación" },
  {
    value: WAREHOUSE_VIRTUAL_SUBTYPE_ENUM.customer_reserved,
    label: "Reservado Cliente",
  },
  {
    value: WAREHOUSE_VIRTUAL_SUBTYPE_ENUM.damaged_goods,
    label: "Mercancía Dañada",
  },
  { value: WAREHOUSE_VIRTUAL_SUBTYPE_ENUM.quarantine, label: "Cuarentena" },
  { value: WAREHOUSE_VIRTUAL_SUBTYPE_ENUM.staging, label: "Preparación" },
  { value: WAREHOUSE_VIRTUAL_SUBTYPE_ENUM.returns, label: "Devoluciones" },
  {
    value: WAREHOUSE_VIRTUAL_SUBTYPE_ENUM.supplier_managed,
    label: "Gestionado por Proveedor",
  },
  { value: WAREHOUSE_VIRTUAL_SUBTYPE_ENUM.general, label: "General" },
];
