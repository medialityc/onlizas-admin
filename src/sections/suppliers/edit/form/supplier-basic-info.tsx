import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import { useFormContext } from "react-hook-form";
import RHFDateInput from "@/components/react-hook-form/rhf-date-input";
import { Title, Group } from "@mantine/core";
import { RHFCountrySelect } from "@/components/react-hook-form/rhf-country-code-select";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { RHFPhoneCountrySelect } from "@/components/react-hook-form/rhf-phone-country-select";
import {
  SUPPLIER_NATIONALITY_OPTIONS,
  SUPPLIER_TYPE_SELLER_OPTIONS,
  SUPPLIER_NATIONALITY,
  SUPPLIER_TYPE_OPTIONS,
} from "../../constants/supplier.options";
import { useMemo, useEffect } from "react";
import { useCountries } from "@/components/phone-input/use-countries";
import { getCountriesPaginated } from "@/services/countries";
import { Button } from "@/components/button/button";

interface SupplierBasicInfoProps {
  approvalProcessId: string | number;
  isEditMode?: boolean;
  onToggleEditMode?: () => void;
}

export default function SupplierBasicInfo({
  approvalProcessId,
  isEditMode = false,
  onToggleEditMode,
}: SupplierBasicInfoProps) {
  const {
    formState: { errors },
    watch,
    setValue,
    trigger,
    getValues,
  } = useFormContext<any>();

  const { countries } = useCountries();

  // Memoizar las fechas para evitar re-renders innecesarios
  const minDate = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => new Date("2100-12-31"), []);

  // Leer los valores para control de nacionalidad
  const nacionalityType = watch("nacionalityType");
  const mincexCode = watch("mincexCode");
  const countryId = watch("countryId");

  // Encontrar Cuba en la lista de países
  const cubaCountry = countries?.find(
    (country) => country.code === "CU" || country.name === "Cuba",
  );

  // Aplicar reglas de nacionalidad
  useEffect(() => {
    if (nacionalityType === SUPPLIER_NATIONALITY.Nacional) {
      // Nacional: Asignar Cuba automáticamente y limpiar código MINCEX
      if (cubaCountry && countryId !== cubaCountry.id) {
        setValue("countryId", cubaCountry.id);
      }
      if (mincexCode) {
        setValue("mincexCode", "");
      }
    }
    // Nota: Para extranjeros, el país se selecciona manualmente desde el componente de autocompletado
  }, [nacionalityType, cubaCountry, countryId, mincexCode, setValue]);

  // Función para guardar cambios
  // La función handleSaveChanges ya no es necesaria ya que el formulario principal maneja el guardado

  if (!isEditMode) {
    // Modo solo lectura
    const supplierType = watch("supplierType");
    const name = watch("name");
    const email = watch("email");
    const phone = watch("phone");
    const sellerType = watch("sellerType");
    const address = watch("address");

    // Obtener labels
    const getSupplierTypeLabel = () => {
      const option = SUPPLIER_TYPE_OPTIONS.find(
        (o) => o.value === supplierType,
      );
      return option?.label || "-";
    };

    const getSellerTypeLabel = () => {
      const option = SUPPLIER_TYPE_SELLER_OPTIONS.find(
        (o) => o.value === sellerType,
      );
      return option?.label || "-";
    };

    const getNationalityLabel = () => {
      const option = SUPPLIER_NATIONALITY_OPTIONS.find(
        (o) => o.value === nacionalityType,
      );
      return option?.label || "-";
    };

    const getCountryLabel = () => {
      const country = countries?.find(
        (c) => String(c.id) === String(countryId),
      );
      return country?.name || "-";
    };

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <Title
            order={3}
            className="text-lg font-semibold text-gray-800 dark:text-gray-100"
          >
            Información Básica
          </Title>
          <Button size="sm" onClick={onToggleEditMode}>
            Editar
          </Button>
        </div>

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
              {(() => {
                const phoneCountryCode = watch("phoneCountryCode");
                const phoneValue = phone || "-";
                if (phoneCountryCode && phone) {
                  const country = countries?.find(
                    (c) => c.code === phoneCountryCode,
                  );
                  return country
                    ? `+${country.phoneNumberCode} ${phoneValue}`
                    : phoneValue;
                }
                return phoneValue;
              })()}
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
          {nacionalityType !== undefined &&
            nacionalityType !== SUPPLIER_NATIONALITY.Nacional && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Código Mincex
                </label>
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                  {mincexCode || "-"}
                </div>
              </div>
            )}

          {/* Fecha de Expiración */}
          <div className="md:col-span-2 pt-4 border-t border-gray-300 dark:border-gray-600">
            <Title
              order={4}
              className="mb-4 text-base font-semibold text-gray-800 dark:text-gray-100"
            >
              Fecha de Expiración
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

  // Modo edición
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Title
          order={3}
          className="text-lg font-semibold text-gray-800 dark:text-gray-100"
        >
          Editar Información Básica
        </Title>
      </div>

      <div className="flex justify-end gap-2 mb-6">
        <Group gap="xs">
          <Button
            variant="destructive"
            type="reset"
            size="sm"
            onClick={onToggleEditMode}
          >
            Cancelar
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Usa el botón "Guardar información básica" de esta sección para
            guardar los cambios
          </span>
        </Group>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de Proveedor */}
        <RHFSelectWithLabel
          name="supplierType"
          label="Tipo de Proveedor"
          options={SUPPLIER_TYPE_OPTIONS}
          required
        />

        {/* Nombre */}
        <RHFInputWithLabel
          name="name"
          label="Nombre del Proveedor"
          placeholder="Ingrese el nombre del proveedor"
          required
        />

        {/* Email */}
        <RHFInputWithLabel
          name="email"
          label="Email"
          type="email"
          placeholder="ejemplo@correo.com"
          required
        />

        {/* Teléfono */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Teléfono <span className="text-red-500">*</span>
          </label>
          <div className="[&_.combobox-trigger]:bg-white [&_.combobox-trigger]:dark:bg-gray-800 [&_.combobox-content]:bg-white [&_.combobox-content]:dark:bg-gray-800">
            <RHFPhoneCountrySelect
              phoneFieldName="phone"
              countryFieldName="phoneCountryCode"
              countryValueKey="code"
            />
          </div>
        </div>

        {/* Tipo de Vendedor */}
        <RHFSelectWithLabel
          name="sellerType"
          label="Tipo de Vendedor"
          options={SUPPLIER_TYPE_SELLER_OPTIONS}
          required
        />

        {/* Nacionalidad */}
        <RHFSelectWithLabel
          name="nacionalityType"
          label="Nacionalidad"
          options={SUPPLIER_NATIONALITY_OPTIONS}
          required
        />

        {/* Dirección */}
        <RHFInputWithLabel
          name="address"
          label="Dirección"
          placeholder="Ingrese la dirección completa"
          required
        />

        {/* Código Mincex - Solo visible para extranjeros y ambos */}
        {nacionalityType !== undefined &&
          nacionalityType !== SUPPLIER_NATIONALITY.Nacional && (
            <RHFInputWithLabel
              name="mincexCode"
              label="Código Mincex"
              placeholder="Ingrese el código MINCEX (requerido para extranjeros)"
              required
            />
          )}

        {/* Información sobre reglas de nacionalidad */}
        <div className="md:col-span-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Reglas de Nacionalidad:
          </h4>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>
              • <strong>Nacional:</strong> Se asigna automáticamente Cuba como
              país y se limpia el código MINCEX
            </li>
            <li>
              • <strong>Extranjero:</strong> Se requiere código MINCEX y
              seleccionar país (búsqueda con scroll infinito)
            </li>
            <li>
              • <strong>Ambos:</strong> Se requiere código MINCEX y seleccionar
              país (búsqueda con scroll infinito)
            </li>
            <li>
              • <strong>Teléfono:</strong> El código de país se aplica
              automáticamente según el país seleccionado
            </li>
          </ul>
        </div>

        {/* Fecha de Expiración - EDITABLE */}
        <div className="md:col-span-2 pt-4 border-t border-gray-300 dark:border-gray-600">
          <Title
            order={4}
            className="mb-4 text-base font-semibold text-gray-800 dark:text-gray-100"
          >
            Fecha de Expiración
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
