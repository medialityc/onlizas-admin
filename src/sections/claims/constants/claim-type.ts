export enum ClaimType {
  DEFECTIVE_PRODUCT = 0,
  WRONG_PRODUCT = 1,
  NOT_RECEIVED = 2,
  INCOMPLETE_ORDER = 3,
  OTHER = 99,
}

export const typeLabelMap: Record<ClaimType, string> = {
  [ClaimType.DEFECTIVE_PRODUCT]: "Producto defectuoso",
  [ClaimType.WRONG_PRODUCT]: "Producto incorrecto",
  [ClaimType.NOT_RECEIVED]: "No recibido",
  [ClaimType.INCOMPLETE_ORDER]: "Pedido incompleto",
  [ClaimType.OTHER]: "Otro",
};
