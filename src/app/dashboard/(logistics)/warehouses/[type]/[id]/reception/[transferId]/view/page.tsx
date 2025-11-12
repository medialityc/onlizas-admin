import { notFound } from "next/navigation";
import { getWarehouseTransferById } from "@/services/warehouses-transfers";
import { getTransferReceptionsByTransferId } from "@/services/warehouse-transfer-receptions";
import { Button } from "@/components/button/button";
import TransferReceptionView from "@/sections/warehouses/components/transfer-reception/transfer-reception-view";
import { WarehouseTransfer } from "@/types/warehouses-transfers";
import BackButton from "@/components/button/back-button";

// Tipo para la respuesta de la API que incluye la transferencia anidada
type WarehouseTransferApiResponse = {
  transfer: WarehouseTransfer;
};

interface Props {
  params: Promise<{
    type: string;
    id: string;
    transferId: string;
  }>;
}

export default async function ViewReceptionPage({ params }: Props) {
  const { type, id, transferId } = await params;

  // Obtener la transferencia
  const transferResponse = await getWarehouseTransferById(transferId);
  const transferData = transferResponse.data as unknown as WarehouseTransferApiResponse;
  if (!transferData?.transfer) {
    notFound();
  }

  // Extraer la transferencia del objeto anidado
  const transfer = transferData.transfer;

  // Obtener las recepciones de esta transferencia
  const receptionsResponse = await getTransferReceptionsByTransferId(transferId);
  
  if (!receptionsResponse?.data?.data || receptionsResponse.data.data.length === 0) {
    notFound();
  }

   const receptionData = receptionsResponse.data.data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Navegación simple */}
        <div className="mb-4">
          <BackButton />
        </div>

        {/* Componente de vista de recepción */}
        <TransferReceptionView
          transfer={transfer}
          receptionsData={receptionData}
        />
      </div>
    </div>
  );
}