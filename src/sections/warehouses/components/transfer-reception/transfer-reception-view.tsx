"use client";

import { WarehouseTransfer } from "@/types/warehouses-transfers";
import { TransferReception } from "@/types/warehouse-transfer-receptions";
import { ReceptionStatusHeader } from "./view/reception-status-header";
import { ReceptionItemsList } from "./view/reception-items-list";
import { DiscrepancySection } from "./view/discrepancy-section";
import { ReceptionNotes } from "./view/reception-notes";
import { notFound } from "next/navigation";

interface Props {
  transfer: WarehouseTransfer;
  receptionsData: TransferReception[];
}

export default function TransferReceptionView({
  transfer,
  receptionsData,
}: Props) {
  const receptionData = receptionsData.find(
    (recepcion) => recepcion.transferId === transfer.id
  );
  if (!receptionData) notFound();

  return (
    <div className="space-y-6">
      {/* Header con estado de la recepción */}
      <ReceptionStatusHeader transfer={transfer} reception={receptionData} />

      {/* Lista de productos recepcionados */}
      <ReceptionItemsList items={receptionData.items} />

      {/* Sección de discrepancias */}
      <DiscrepancySection reception={receptionData} />

      {/* Notas de la recepción */}
      <ReceptionNotes reception={receptionData} />
    </div>
  );
}
