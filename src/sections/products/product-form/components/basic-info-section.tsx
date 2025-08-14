'use client';

import RHFInputWithLabel from '@/components/react-hook-form/rhf-input';
import RHFCheckbox from '@/components/react-hook-form/rhf-checkbox';

function BasicInfoSection() {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">🧊</span> Información Básica
      </h3>
      <div className="space-y-6">
        <RHFInputWithLabel
          name="name"
          label="Nombre del Producto *"
          placeholder="Ej: iPhone 15 Pro Max"
          required
        />
        <RHFInputWithLabel
          name="description"
          label="Descripción"
          type="textarea"
          placeholder="Describe las características principales del producto..."
          rows={3}
        />
        <RHFCheckbox name="isActive" label="Producto activo" />
      </div>
    </div>
  );
}

export default BasicInfoSection;
