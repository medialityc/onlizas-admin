import { getWarehouseTransferById } from "@/services/warehouses-transfers";
import { WAREHOUSE_TYPE_ENUM } from "@/sections/warehouses/constants/warehouse-type";
import TransferReceptionContainer from "@/sections/warehouses/containers/transfer-reception-container";
import BackButton from "@/components/button/back-button";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { WAREHOUSE_TRANSFER_OPTIONS } from "@/types/warehouses-transfers";

export const metadata: Metadata = {
  title: "Recepcionar Transferencia - ZAS Express",
  description: "Recepcionar productos de transferencia en almacén",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

type PageProps = {
  params: Promise<{ id: string; type: string; transferId: string }>;
};

export default async function WarehouseReceptionProcessPage({
  params,
}: PageProps) {
  const { id, type, transferId } = await params;

  if (!Object.keys(WAREHOUSE_TYPE_ENUM).includes(type)) {
    notFound();
  }

  const transferResponse = await getWarehouseTransferById(transferId);
  if (!transferResponse?.data) {
    notFound();
  }

  // Extraer la transferencia del objeto anidado (basado en la estructura real del API)
  console.log('Transfer response:', transferResponse);
  const transfer = (transferResponse.data as any).transfer || transferResponse.data;
  console.log('Extracted transfer:', transfer);

  // Verificar que la transferencia está en estado para recepcionar
  // TEMPORALMENTE DESACTIVADO PARA DEBUG
  // if (!['InTransit', 'AwaitingReception'].includes(transfer.status)) {
  //   notFound();
  // }

  // Verificar que la transferencia es para este almacén (como destino)
  // TEMPORALMENTE DESACTIVADO PARA DEBUG
  // if (transfer.destinationId !== id) {
  //   notFound();
  // }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Navegación simple */}
        <div className="mb-4">
          <BackButton />
        </div>

        {/* Header simple */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recepcionar Transferencia #{transfer.transferNumber}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Origen: {transfer.originWarehouseName} → Destino: {transfer.destinationWarehouseName}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                {WAREHOUSE_TRANSFER_OPTIONS.find(opt => opt.value === transfer.status)?.label || transfer.status}
              </span>
            </div>
          </div>
        </div>

        {/* Contenedor de recepción */}
        <TransferReceptionContainer
          transfer={transfer}
        />
      </div>
    </div>
  );
}