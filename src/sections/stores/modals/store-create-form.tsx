import LoaderButton from "@/components/loaders/loader-button";
import { RHFInputWithLabel } from "@/components/react-hook-form";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import {
  getAllBusinessByProvider,
  getAllBusinessByUser,
} from "@/services/business";
import React, { useEffect } from "react";
import { StoreFormData } from "./stores-schema";
import { useFormContext } from "react-hook-form";
import { getAllSupplierUsers } from "@/services/users";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuth } from "zas-sso-client";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { RHFPhoneCountrySelect } from "@/components/react-hook-form/rhf-phone-country-select";
type Props = {
  isSubmitting: boolean;
  handleClose: VoidFunction;
};
function StoreCreateForm({ handleClose, isSubmitting }: Props) {
  const { watch, setValue } = useFormContext<StoreFormData>();
  const ownerId = watch("ownerId");

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasCreatePermission = hasPermission([
    PERMISSION_ENUM.CREATE,
    PERMISSION_ENUM.SUPPLIER_CREATE,
  ]);
  const hasCreateStorePermission = hasPermission([
    PERMISSION_ENUM.SUPPLIER_CREATE,
  ]);
  const { user } = useAuth();
  const isSupplierMode =
    !hasCreatePermission && hasCreateStorePermission && user?.id;

  // Clear business when owner changes
  useEffect(() => {
    if (ownerId) {
      setValue("businessId", "");
    }
  }, [ownerId, setValue]);
  // Si modo proveedor: setear ownerId oculto y limpiar business cuando cambia usuario
  useEffect(() => {
    if (isSupplierMode && user?.id) {
      // establecer ownerId interno si no está
      if (!ownerId) {
        setValue("ownerId", String(user.id));
      }
    }
  }, [isSupplierMode, user, ownerId, setValue]);

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RHFInputWithLabel
            name="name"
            label="Nombre de Tienda"
            placeholder="Ingrese el nombre de su tienda"
            //autoFocus
            maxLength={100}
            required
            size="medium"
            containerClassname="[&>div>div>label]:text-base"
          />
          <RHFInputWithLabel
            name="url"
            label="URL de la Tienda"
            placeholder="tu-tienda-online"
            type="text"
            required
            size="medium"
            containerClassname="[&>div>div>label]:text-base"
          />
        </div>
        {!isSupplierMode && (
          <RHFAutocompleteFetcherInfinity
            name="ownerId"
            label="Propietario"
            placeholder="Buscar propietario..."
            required
            onFetch={getAllSupplierUsers}
            size="medium"
            key={`owner-${ownerId}`}
          />
        )}
        {/* Negocio depende del modo */}
        {!isSupplierMode && ownerId && (
          <RHFAutocompleteFetcherInfinity
            key={`business-${ownerId}`}
            queryKey={`business-by-owner-${ownerId}`}
            enabled={!!ownerId}
            name="businessId"
            label="Negocio"
            placeholder="Buscar negocio..."
            required
            onFetch={(params) => getAllBusinessByProvider(ownerId, params)}
            size="medium"
          />
        )}
        {isSupplierMode && (
          <RHFAutocompleteFetcherInfinity
            key={`business-by-user-${user?.id}`}
            queryKey={`business-by-user-${user?.id}`}
            enabled={!!user?.id}
            name="businessId"
            label="Negocio"
            placeholder="Buscar negocio..."
            required
            onFetch={(params) => getAllBusinessByUser(params)}
            size="medium"
          />
        )}
        {/* Logo Upload */}
        <RHFImageUpload
          name="logoStyle"
          label="Logo de la tienda "
          variant="rounded"
          size="full"
          className="[&>label]:text-base"
        />
        {/* Email Input */}
        <RHFInputWithLabel
          name="email"
          label="Email"
          placeholder="contacto@store.com"
          type="email"
          required
          size="medium"
          containerClassname="[&>div>div>label]:text-base"
        />

        <div>
          <label
            htmlFor="phoneNumber"
            className="mb-[14px] block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Teléfono <span className="text-danger">*</span>
          </label>
          {/* Country prefix + phone input together (no separation) */}
          <RHFPhoneCountrySelect
            countryFieldName="countryCode"
            countryValueKey="code"
            phoneFieldName="phoneNumber"
          />
        </div>

        {/* Address Input */}
        <RHFInputWithLabel
          name="address"
          label="Dirección"
          placeholder="Calle Principal 123, Ciudad, País"
          maxLength={200}
          rows={3}
          type="textarea"
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <button
          type="button"
          onClick={handleClose}
          className="btn btn-outline-secondary"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        {hasCreatePermission && (
          <LoaderButton
            type="submit"
            loading={isSubmitting}
            className="btn btn-primary"
          >
            Crear Tienda
          </LoaderButton>
        )}
      </div>
    </>
  );
}

export default StoreCreateForm;
