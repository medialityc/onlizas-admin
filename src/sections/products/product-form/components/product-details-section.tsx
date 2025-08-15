'use client';

import IconPlus from '@/components/icon/icon-plus';
import RHFInputWithLabel from '@/components/react-hook-form/rhf-input';
import { Button } from '@/components/button/button';
import { useFieldArray, useFormContext } from 'react-hook-form';
import IconTrash from '@/components/icon/icon-trash';
import IconClipboardText from '@/components/icon/icon-clipboard-text';

function ProductDetailsSection () {
  const { control } = useFormContext();
  const {
    fields: detailFields,
    append: appendDetail,
    remove: removeDetail,
  } = useFieldArray({
    control,
    name: 'details',
  });

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <IconClipboardText className="mr-2 w-5 h-5" /> Detalles del Producto
        </h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => appendDetail({ name: '', value: '' })}
          className="flex items-center gap-2"
        >
          <IconPlus className="w-4 h-4" />
          Detalle
        </Button>
      </div>      <div className="space-y-4">
        {detailFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-5 gap-3 items-center">
            <div className="col-span-2">
              <RHFInputWithLabel
                name={`details.${index}.name`}
                label="Nombre"
                placeholder="Nombre"
              />
            </div>
            <div className="col-span-2">
              <RHFInputWithLabel
                name={`details.${index}.value`}
                label="Valor"
                placeholder="Valor"
              />
            </div>
            <div className="col-span-1 pb-1 h-full flex justify-end items-end">              <Button
              type="button"
              size="sm"
              onClick={() => removeDetail(index)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 hover:border-red-400 px-2"
            >
              <IconTrash className="w-4 h-4" />
            </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductDetailsSection;
