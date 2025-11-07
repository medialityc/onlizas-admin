import { getWarehouseTransferById } from "@/services/warehouses-transfers";
import { WAREHOUSE_TYPE_ENUM } from "@/sections/warehouses/constants/warehouse-type";
import BackButton from "@/components/button/back-button";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import TransferStatusCell from "@/sections/warehouses/components/transfer-cell/transfer-status-cell";

export const metadata: Metadata = {
  title: "Detalles de Transferencia - ZAS Express",
  description: "Ver detalles de transferencia de almacén",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

type PageProps = {
  params: Promise<{ id: string; type: string; transferId: string }>;
};

export default async function TransferDetailsPage({
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

  // Extraer la transferencia del objeto anidado
  const transfer = (transferResponse.data as any).transfer || transferResponse.data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Navegación */}
        <div className="mb-4">
          <BackButton />
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Transferencia #{transfer.transferNumber}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Origen: {transfer.originWarehouseName} → Destino: {transfer.destinationWarehouseName}
              </p>
            </div>
            <div className="text-right">
              <TransferStatusCell status={transfer.status} />
            </div>
          </div>
        </div>

        {/* Detalles de la transferencia */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Información de la Transferencia
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Almacén Origen
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {transfer.originWarehouseName}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Almacén Destino
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {transfer.destinationWarehouseName}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de Creación
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {new Date(transfer.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Última Actualización
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {new Date(transfer.updatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Productos en la transferencia */}
        {transfer.items && transfer.items.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Productos en la Transferencia
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Unidad
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {transfer.items.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {item.productVariantName || item.productName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {item.quantityRequested || item.quantity || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {item.unit || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No hay productos en esta transferencia
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}