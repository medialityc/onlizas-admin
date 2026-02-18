"use client";

import { useState } from "react";
import { TransferReception } from "@/types/warehouse-transfer-receptions";
import { WarehouseFormData } from "../../schemas/warehouse-schema";
import { Button } from "@/components/button/button";
import {
  ChatBubbleLeftIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface Props {
  reception: TransferReception;
  warehouse: WarehouseFormData;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ReceptionDiscrepanciesTab({
  reception: _reception,
  warehouse: _warehouse,
}: Props) {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // Datos de ejemplo para el producto con discrepancia
  const discrepantProduct = {
    name: "Laptop Dell Inspiron 15 - 8GB RAM",
    transferred: 10,
    received: 10,
    status: "incompleto", // "incompleto" | "correcto" | "pendiente"
  };

  const handleActionChange = (action: string) => {
    setSelectedAction(action);
  };

  const handleRegister = () => {
    // Aquí iría la lógica para registrar la comunicación
    console.log("Registrando comunicación:", { selectedAction, message });
  };

  return (
    <div className="space-y-6">
      {/* Header de Gestión de Incidencias */}
      <div className="flex items-center gap-2 mb-4">
        <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
        <h3 className="text-lg font-medium text-dark dark:text-white-light">
          Gestión de Incidencias
        </h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Comunícate con el almacén de origen para resolver discrepancias
      </p>

      {/* Alerta de productos con discrepancias */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />
          <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">
            Se han identificado 1 productos con discrepancias.
          </span>
        </div>
      </div>

      {/* Producto con discrepancia */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-dark dark:text-white-light">
            {discrepantProduct.name}
          </h4>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            Producto Incompleto
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              Transferido:
            </span>
            <span className="ml-2 font-medium text-dark dark:text-white-light">
              {discrepantProduct.transferred} unidades
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Recibido:</span>
            <span className="ml-2 font-medium text-dark dark:text-white-light">
              {discrepantProduct.received} unidades
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <h5 className="text-sm font-medium text-dark dark:text-white-light mb-3">
              Nueva Comunicación
            </h5>

            {/* Selector de tipo de comunicación */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => handleActionChange("message")}
                className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg ${
                  selectedAction === "message"
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <ChatBubbleLeftIcon className="h-4 w-4" />
                Mensaje
              </button>

              <button
                onClick={() => handleActionChange("call")}
                className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg ${
                  selectedAction === "call"
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <PhoneIcon className="h-4 w-4" />
                Llamada
              </button>
            </div>

            {/* Área de texto para el mensaje */}
            {selectedAction && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark dark:text-white-light mb-2">
                  Describe la comunicación o acción realizada...
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white resize-none"
                  rows={4}
                  placeholder="Describe la comunicación o acción realizada..."
                />
              </div>
            )}

            {/* Botones de acción adicionales */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button variant="secondary" size="sm" className="text-xs">
                📞 Notificar Origen
              </Button>
              <Button variant="secondary" size="sm" className="text-xs">
                📄 Solicitar Devolución
              </Button>
              <Button variant="secondary" size="sm" className="text-xs">
                📋 Registrar Llamada
              </Button>
              <Button variant="secondary" size="sm" className="text-xs">
                ⚠️ Escalar Incidencia
              </Button>
            </div>

            {/* Botón de registro */}
            {selectedAction && message.trim() && (
              <Button
                onClick={handleRegister}
                variant="primary"
                className="w-full sm:w-auto"
              >
                ✓ Registrar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
