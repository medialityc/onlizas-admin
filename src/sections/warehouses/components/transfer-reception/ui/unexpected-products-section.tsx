import React from "react";
import { Button } from "@/components/button/button";
import IconTrash from "@/components/icon/icon-trash";
import UnexpectedProductForm from "../unexpected-product-form";

interface UnexpectedProductsSectionProps {
  unexpectedProducts: any[];
  showUnexpectedForm: boolean;
  onToggleForm: () => void;
  onAddProduct: (product: any) => void;
  onRemoveProduct: (index: number) => void;
  isReceptionCompleted?: boolean;
}

export function UnexpectedProductsSection({
  unexpectedProducts,
  showUnexpectedForm,
  onToggleForm,
  onAddProduct,
  onRemoveProduct,
  isReceptionCompleted,
}: UnexpectedProductsSectionProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <span>Productos No Esperados</span>
              {unexpectedProducts.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  {unexpectedProducts.length}
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Registra productos que llegaron pero no estaban en la lista original
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => onToggleForm()}
          disabled={isReceptionCompleted}
        >
          + Agregar Producto
        </Button>
      </div>

      {/* Formulario para productos no esperados */}
      {showUnexpectedForm && (
        <div className="mb-6">
          <UnexpectedProductForm
            onSave={onAddProduct}
            onCancel={() => onToggleForm()}
          />
        </div>
      )}

      {/* Lista de productos no esperados agregados */}
      {unexpectedProducts.length > 0 ? (
        <div className="space-y-3">
          {unexpectedProducts.map((product, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                      Producto #{index + 1}
                    </span>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {product.productName}
                    </h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Cantidad:</span> {product.quantity} {product.unit}
                    </p>
                    {product.batchNumber && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Lote:</span> {product.batchNumber}
                      </p>
                    )}
                    {product.observations && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Observaciones:</span> {product.observations}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => onRemoveProduct(index)}
                  disabled={isReceptionCompleted}
                  title={isReceptionCompleted ? "No puede eliminar productos después de completar la recepción" : "Eliminar producto"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">
            No se han registrado productos no esperados
          </p>
        </div>
      )}
    </div>
  );
}