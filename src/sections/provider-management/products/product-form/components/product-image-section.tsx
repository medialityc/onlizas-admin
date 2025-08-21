'use client';

import { RHFImageUpload } from '@/components/react-hook-form/rhf-image-upload';
import IconGallery from '@/components/icon/icon-gallery';

function ProductImageSection () {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <IconGallery className="mr-2 w-5 h-5" /> Imagen del Producto
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
