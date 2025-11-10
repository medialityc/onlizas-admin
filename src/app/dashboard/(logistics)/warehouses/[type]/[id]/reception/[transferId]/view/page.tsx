import { notFound } from "next/navigation";
import { getWarehouseTransferById } from "@/services/warehouses-transfers";
import { getTransferReceptionById } from "@/services/warehouse-transfer-receptions";
import { Button } from "@/components/button/button";
import TransferReceptionView from "@/sections/warehouses/components/transfer-reception/transfer-reception-view";

interface Props {
  params: {
    type: string;
    id: string;
    transferId: string;
  };
}

export default async function ViewReceptionPage({ params }: Props) {
  const { type, id, transferId } = params;

  // Obtener la transferencia
  const transferResponse = await getWarehouseTransferById(transferId);
  if (!transferResponse?.data) {
    notFound();
  }

  // Extraer la transferencia del objeto anidado
  const transfer = (transferResponse.data as any).transfer || transferResponse.data;

  // Por ahora simulamos obtener la recepción - necesitarás implementar el endpoint real
  // const receptionResponse = await getTransferReceptionById(receptionId);
  // if (!receptionResponse?.data) {
  //   notFound();
  // }
  // const receptionData = receptionResponse.data;

  // Simulación de datos de recepción para desarrollo
  const receptionData = {
    id: "rec-123",
    transferId: transferId,
    status: "completed",
    receivedAt: new Date().toISOString(),
    items: transfer.items?.map((item: any) => ({
      id: `rec-item-${item.id}`,
      transferItemId: item.id,
      quantityReceived: item.quantityRequested,
      notes: "Producto recibido correctamente"
    })) || [],
    comments: [
      {
        id: "comment-1",
        message: "Recepción completada sin incidencias",
        author: "Sistema",
        createdAt: new Date().toISOString(),
        type: "general"
      }
    ],
    notes: "Recepción realizada exitosamente"
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Navegación simple */}
        <div className="mb-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
          >
            ← Volver
          </Button>
        </div>

        {/* Header simple */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Transferencia #{transfer.transferNumber}
              </div>
              <div className="text-lg text-green-600 dark:text-green-400 font-medium">
                Recepción ID: {receptionData.id}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Origen: {transfer.originWarehouseName} → Destino: {transfer.destinationWarehouseName}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Vista de Solo Lectura
              </span>
            </div>
          </div>
        </div>

        {/* Componente de vista de recepción */}
        <TransferReceptionView
          transfer={transfer}
          receptionData={receptionData}
        />
      </div>
    </div>
  );
}