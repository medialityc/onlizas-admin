'use client';

import { RHFImageUpload } from '@/components/react-hook-form/rhf-image-upload';

function ProductImageSection () {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">🖼️</span> Imagen del Producto
      </h3>
      <div className="flex w-full">
        <RHFImageUpload
          name="imageFile"
          variant="square"
          size='full'
          className="flex-1"
        />
      </div>
    </div>
  );
}

export default ProductImageSection;
