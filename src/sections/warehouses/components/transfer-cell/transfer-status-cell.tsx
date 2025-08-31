import Badge, { Variant } from "@/components/badge/badge";
import { WAREHOUSE_TRANSFER_STATUS } from "@/types/warehouses-transfers";

type Props = {
  status: WAREHOUSE_TRANSFER_STATUS;
};

const variant: Record<WAREHOUSE_TRANSFER_STATUS, Variant> = {
  Pending: "secondary",
  Approved: "primary",
  InTransit: "info",
  Completed: "success",
  Cancelled: "danger",
};
const traduction: Record<WAREHOUSE_TRANSFER_STATUS, string> = {
  Pending: "Pendiente",
  Approved: "Aprobado",
  InTransit: "En transferencia",
  Completed: "Completado",
  Cancelled: "Cancelado",
};

const TransferStatusCell = ({ status }: Props) => {
  if (!status) return <>-</>;

  return <Badge variant={variant[status]}>{traduction[status]}</Badge>;
};

export default TransferStatusCell;
