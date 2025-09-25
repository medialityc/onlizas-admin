"use client";

import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import IconChartSquare from "@/components/icon/icon-chart-square";

function ProductDimensionSection() {
  return (
    <div className="bg-blur-card flex-1 h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <IconChartSquare className="mr-2 w-5 h-5" /> Especificaciones
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Dimensiones (cm)
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div>
          <RHFInputWithLabel
            name="width"
            label="Ancho"
            type="number"
            placeholder="0"
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <RHFInputWithLabel
            name="height"
            label="Alto"
            type="number"
            placeholder="0"
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <RHFInputWithLabel
            name="length"
            label="Largo"
            type="number"
            placeholder="0"
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <RHFInputWithLabel
            name="weight"
            label="Peso (lb)"
            type="number"
            placeholder="0"
            min="0"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDimensionSection;
