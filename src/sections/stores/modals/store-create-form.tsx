import LoaderButton from "@/components/loaders/loader-button";
import { RHFInputWithLabel } from "@/components/react-hook-form";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import { getAllUserBusiness } from "@/services/business";
import React, { useEffect } from "react";
import { StoreFormData } from "./stores-schema";
import { useFormContext } from "react-hook-form";
import { getAllSupplierUsers } from "@/services/users";
type Props = {
  isSubmitting: boolean;
  handleClose: VoidFunction;
};
function StoreCreateForm({ handleClose, isSubmitting }: Props) {
  const { watch, resetField } = useFormContext<StoreFormData>();
  const ownerId = watch("ownerId");
  console.log(ownerId);

  // Clear business when owner changes
  useEffect(() => {
    if (ownerId) {
      resetField("businessId");
    }
  }, [ownerId, resetField]);

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
            placeholder="https://mi-tienda.com"
            type="text"
            required
            size="medium"
            containerClassname="[&>div>div>label]:text-base"
          />
        </div>
        <RHFAutocompleteFetcherInfinity
          name="ownerId"
          label="Propietario"
          placeholder="Buscar propietario..."
          required
          onFetch={getAllSupplierUsers}
          size="medium"
        />
        {ownerId && (
          <RHFAutocompleteFetcherInfinity
            key={`business-${ownerId}`}
            queryKey={`business-by-owner-${ownerId}`}
            enabled={!!ownerId}
            name="businessId"
            label="Negocio"
            placeholder="Buscar negocio..."
            required
            onFetch={(params) => getAllUserBusiness(ownerId, params)}
            size="medium"
          />
        )}
        {/* Logo Upload */}
        <RHFImageUpload
          name="logoStyle"
          label="Logo de la tienda *"
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

        {/* Phone Input */}
        <RHFInputWithLabel
          name="phoneNumber"
          label="Teléfono"
          placeholder="+1234567890"
          maxLength={20}
          required
          size="medium"
          type="tel"
        />

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
        {/* Return Policy Input */}
        <RHFInputWithLabel
          name="returnPolicy"
          label="Política de Reembolso"
          placeholder=" Escriba la política que seguirá su tienda"
          maxLength={200}
          rows={3}
          type="textarea"
          required
          size="medium"
        />
        {/* Shipping Policy Input */}
        <RHFInputWithLabel
          name="shippingPolicy"
          label="Política de Envío"
          placeholder=" Escriba la política que seguirá su tienda"
          maxLength={200}
          rows={3}
          type="textarea"
          required
          size="medium"
          containerClassname="[&>label]:text-base [&>textarea]:text-sm"
        />
        {/* Terms of Service Input */}
        <RHFInputWithLabel
          name="termsOfService"
          label="Términos del Servicio"
          placeholder=" Escriba la términos que seguirá su tienda"
          maxLength={200}
          rows={3}
          type="textarea"
          required
          size="medium"
          containerClassname="[&>label]:text-base [&>textarea]:text-sm"
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
        <LoaderButton
          type="submit"
          loading={isSubmitting}
          className="btn btn-primary text-textColor"
        >
          Tienda
        </LoaderButton>
      </div>
    </>
  );
}

export default StoreCreateForm;
