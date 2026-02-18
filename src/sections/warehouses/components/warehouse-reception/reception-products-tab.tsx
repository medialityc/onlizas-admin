"use client";

import { useState } from "react";
import { TransferReception } from "@/types/warehouse-transfer-receptions";
import { WarehouseFormData } from "../../schemas/warehouse-schema";
import { Button } from "@/components/button/button";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Props {
  reception: TransferReception;
  warehouse: WarehouseFormData;
}

// Datos de ejemplo para mostrar la estructura
const mockProducts = [
  {
    id: 1,
    name: "Laptop Dell Inspiron 15 - 8GB RAM",
    transferred: 10,
    received: 10,
    status: "correct",
  },
  {
    id: 2,
    name: "Mouse Inalámbrico Logitech MX Master 3",
    transferred: 25,
    received: 25,
    status: "correct",
  },
  {
    id: 3,
    name: "Teclado Mecánico Corsair K95 RGB",
    transferred: 15,
    received: null,
    status: "pending",
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ReceptionProductsTab({
  reception: _reception,
  warehouse: _warehouse,
}: Props) {
  const [products, setProducts] = useState(mockProducts);

  const handleReceivedQuantityChange = (
    productId: number,
    quantity: number,
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              received: quantity,
              status:
                quantity === product.transferred ? "correct" : "discrepancy",
            }
          : product,
      ),
    );
  };

  const getStatusIcon = (status: string, received: number | null) => {
    if (received === null) {
      return <div className="w-5 h-5" />; // Espacio vacío
    }

    if (status === "correct") {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    } else {
      return <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
          <CheckCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-medium text-dark dark:text-white-light">
          Productos a Recepcionar
        </h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Verifica las cantidades recibidas para cada producto
      </p>

      {/* Lista de productos */}
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-medium text-dark dark:text-white-light mb-2">
                  {product.name}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Cantidad transferida:
                    </span>
                    <span className="ml-2 font-medium text-dark dark:text-white-light">
                      {product.transferred} unidades
                    </span>
                  </div>
                </div>
              </div>

              {product.status !== "pending" && (
                <Button variant="secondary" size="sm" className="text-xs">
                  ⚠️ Marcar Discrepancia
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-dark dark:text-white-light mb-2">
                  Cantidad Recibida
                </label>
                <input
                  type="number"
                  min="0"
                  max={product.transferred}
                  value={product.received || ""}
                  onChange={(e) =>
                    handleReceivedQuantityChange(
                      product.id,
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center gap-2">
                {getStatusIcon(product.status, product.received)}
                {product.received !== null && (
                  <span
                    className={`text-sm font-medium ${
                      product.status === "correct"
                        ? "text-green-600 dark:text-green-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {product.status === "correct" ? "Correcto" : "Discrepancia"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button variant="secondary">Guardar Borrador</Button>
        <Button variant="primary">Completar Recepción</Button>
      </div>
    </div>
  );
}
