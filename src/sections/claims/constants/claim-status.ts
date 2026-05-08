export enum ClaimStatus {
  PENDING = 0,
  UNDER_REVIEW = 1,
  RESOLVED_FAVOR_CLIENT = 2,
  RESOLVED_FAVOR_SUPPLIER = 3,
  CANCELLED = 4,
}

export const statusVariantMap: Record<
  ClaimStatus,
  { variant: "outline-warning" | "outline-info" | "outline-success" | "outline-danger" | "outline-secondary"; label: string }
> = {
  [ClaimStatus.PENDING]: { variant: "outline-warning", label: "Pendiente de revisión" },
  [ClaimStatus.UNDER_REVIEW]: { variant: "outline-info", label: "En revisión" },
  [ClaimStatus.RESOLVED_FAVOR_CLIENT]: { variant: "outline-success", label: "Resuelta — Devolución" },
  [ClaimStatus.RESOLVED_FAVOR_SUPPLIER]: { variant: "outline-danger", label: "Resuelta — No aplica" },
  [ClaimStatus.CANCELLED]: { variant: "outline-secondary", label: "Cancelada" },
};
