import Badge, { Variant } from "@/components/badge/badge";
import { WAREHOUSE_TRANSFER_STATUS } from "@/types/warehouses-transfers";

type Props = {
  status: WAREHOUSE_TRANSFER_STATUS;
};

const variant: Record<WAREHOUSE_TRANSFER_STATUS, Variant> = {
  Pending: "secondary",
  Approved: "primary",
  InTransit: "info",
  AwaitingReception: "warning",
  Completed: "success",
  Cancelled: "danger",
  PartiallyReceived: "warning",
  ReceivedWithDiscrepancies: "warning",
  Conciliated: "success",
};
const traduction: Record<WAREHOUSE_TRANSFER_STATUS, string> = {
  Pending: "Pendiente",
  Approved: "Aprobado",
  InTransit: "En transferencia",
  AwaitingReception: "Esperando recepción",
  Completed: "Completado",
  Cancelled: "Cancelado",
  PartiallyReceived: "Parcialmente recibido",
  ReceivedWithDiscrepancies: "Recibido con discrepancias",
  Conciliated: "Conciliado",
};

const TransferStatusCell = ({ status }: Props) => {
  if (!status) return <>-</>;

  return <Badge variant={variant[status]}>{traduction[status]}</Badge>;
};

export default TransferStatusCell;
