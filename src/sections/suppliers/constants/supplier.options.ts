export enum SUPPLIER_TYPE_SELLER {
  Mayorista = 0,
  Minorista = 1,
  Ambos = 2,
  Extranjero = 3,
}

// Tipo de proveedor usado en aprobación (string en backend, mapeado a valores numéricos aquí)
export enum SUPPLIER_TYPE {
  Empresa = 0, // Mipyme
  Persona = 1, // TCP
  Extranjero = 2, // Proveedor extranjero
}

export enum SUPPLIER_NATIONALITY {
  Nacional = 0,
  Extranjero = 1,
  Ambos = 2,
}

export const SUPPLIER_TYPE_SELLER_OPTIONS = [
  { value: SUPPLIER_TYPE_SELLER.Mayorista, label: "Mayorista" },
  { value: SUPPLIER_TYPE_SELLER.Minorista, label: "Minorista" },
  { value: SUPPLIER_TYPE_SELLER.Ambos, label: "Ambos" },
  { value: SUPPLIER_TYPE_SELLER.Extranjero, label: "Extranjero" },
];

export const SUPPLIER_NATIONALITY_OPTIONS = [
  { value: SUPPLIER_NATIONALITY.Nacional, label: "Nacional" },
  { value: SUPPLIER_NATIONALITY.Extranjero, label: "Extranjero" },
  { value: SUPPLIER_NATIONALITY.Ambos, label: "Ambos" },
];

export const SUPPLIER_TYPE_OPTIONS = [
  { value: SUPPLIER_TYPE.Persona, label: "TCP" },
  { value: SUPPLIER_TYPE.Empresa, label: "Mipyme" },
  { value: SUPPLIER_TYPE.Extranjero, label: "Extranjero" },
];

export const SUPPLIER_TYPE_OPTIONS_DET = [
  { value: "Persona", label: "TCP" },
  { value: "Empresa", label: "Mipyme" },
  { value: "Extranjero", label: "Extranjero" },
];
