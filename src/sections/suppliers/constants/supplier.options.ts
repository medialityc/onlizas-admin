export enum SUPPLIER_TYPE_SELLER {
  "Mayorista",
  "Minorista",
  "Ambos",
}
export enum SUPPLIER_TYPE {
  "Empresa",
  "Persona",
}
export enum SUPPLIER_NATIONALITY {
  "Nacional",
  "Extranjero",
  "Ambos",
}

export const SUPPLIER_TYPE_SELLER_OPTIONS = [
  { value: SUPPLIER_TYPE_SELLER.Mayorista, label: "Mayorista" },
  { value: SUPPLIER_TYPE_SELLER.Minorista, label: "Minorista" },
  { value: SUPPLIER_TYPE_SELLER.Ambos, label: "Ambos" },
];
export const SUPPLIER_NATIONALITY_OPTIONS = [
  { value: SUPPLIER_NATIONALITY.Nacional, label: "Nacional" },
  { value: SUPPLIER_NATIONALITY.Extranjero, label: "Extranjero" },
  { value: SUPPLIER_NATIONALITY.Ambos, label: "Ambos" },
];
export const SUPPLIER_TYPE_OPTIONS = [
  { value: SUPPLIER_TYPE.Empresa, label: "Mipyme" },
  { value: SUPPLIER_TYPE.Persona, label: "TCP" },
];
