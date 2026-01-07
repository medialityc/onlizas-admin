import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import { useFormContext } from "react-hook-form";
import RHFDateInput from "@/components/react-hook-form/rhf-date-input";
import { Title } from "@mantine/core";
import {
  SUPPLIER_NATIONALITY_OPTIONS,
  SUPPLIER_TYPE_SELLER_OPTIONS,
  SUPPLIER_NATIONALITY,
  SUPPLIER_TYPE_OPTIONS,
} from "../../constants/supplier.options";
import { useMemo } from "react";

export default function SupplierBasicInfo() {
  const {
    formState: { errors },
    watch,
  } = useFormContext<any>();
  
  // Memoizar las fechas para evitar re-renders innecesarios
  const minDate = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => new Date("2100-12-31"), []);

  // Leer los valores para mostrarlos como solo lectura
  const supplierType = watch("supplierType");
  const name = watch("name");
  const email = watch("email");
  const phone = watch("phone");
  const sellerType = watch("sellerType");
  const nacionalityType = watch("nacionalityType");
  const address = watch("address");
  const mincexCode = watch("mincexCode");
  const message = watch("message");

  // Obtener labels
  const getSupplierTypeLabel = () => {
    const option = SUPPLIER_TYPE_OPTIONS.find(o => o.value === supplierType);
    return option?.label || "-";
  };

  const getSellerTypeLabel = () => {
    const option = SUPPLIER_TYPE_SELLER_OPTIONS.find(o => o.value === sellerType);
    return option?.label || "-";
  };

  const getNationalityLabel = () => {
    const option = SUPPLIER_NATIONALITY_OPTIONS.find(o => o.value === nacionalityType);
    return option?.label || "-";
  };

  return (
    <>
      <Title order={3} className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Información Básica (Solo Lectura)
      </Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de Proveedor */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tipo de Proveedor
          </label>
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            {getSupplierTypeLabel()}
          </div>
        </div>

        {/* Nombre */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre del Proveedor
          </label>
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            {name || "-"}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 break-all">
            {email || "-"}
          </div>
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Teléfono
          </label>
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            {phone || "-"}
          </div>
        </div>

        {/* Tipo de Vendedor */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tipo de Vendedor
          </label>
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            {getSellerTypeLabel()}
          </div>
        </div>

        {/* Nacionalidad */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nacionalidad
          </label>
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            {getNationalityLabel()}
          </div>
        </div>

        {/* Dirección */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Dirección
          </label>
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            {address || "-"}
          </div>
        </div>

        {/* Código Mincex */}
        {nacionalityType !== undefined && nacionalityType !== SUPPLIER_NATIONALITY.Nacional && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Código Mincex
            </label>
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              {mincexCode || "-"}
            </div>
          </div>
        )}

        {/* Mensaje/Comentarios */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mensaje/Comentarios
          </label>
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 min-h-20 whitespace-pre-wrap">
            {message || "-"}
          </div>
        </div>

        {/* Fecha de Expiración - EDITABLE */}
        <div className="md:col-span-2 pt-4 border-t border-gray-300 dark:border-gray-600">
          <Title order={4} className="mb-4 text-base font-semibold text-gray-800 dark:text-gray-100">
            Fecha de Expiración (Editable)
          </Title>
          <div className="w-full md:w-1/2">
            <RHFDateInput
              minDate={minDate}
              maxDate={maxDate}
              name="expirationDate"
              label="Fecha de Expiración"
            />
          </div>
        </div>
      </div>
    </>
  );
}
