'use client';

import RHFInputWithLabel from '@/components/react-hook-form/rhf-input';
import IconChartSquare from '@/components/icon/icon-chart-square';

function SpecificationsSection () {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <IconChartSquare className="mr-2 w-5 h-5" /> Especificaciones
      </h3>
      <p className="text-sm text-gray-600 mb-4">Dimensiones (cm)</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <RHFInputWithLabel
            name="dimensions.width"
            label="Ancho"
            type="number"
            placeholder="0"
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <RHFInputWithLabel
            name="dimensions.height"
            label="Alto"
            type="number"
            placeholder="0"
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <RHFInputWithLabel
            name="dimensions.lenght"
            label="Largo"
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

export default SpecificationsSection;
