import React from "react";
// Clean corrected implementation below
import { usePermissions } from "@/hooks/use-permissions";
import LoaderButton from "@/components/loaders/loader-button";
import {
  RHFFileUpload,
  RHFInputWithLabel,
  RHFSelectWithLabel,
  RHFSwitch,
} from "@/components/react-hook-form";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllUsers } from "@/services/users";
import { getAllBusiness } from "@/services/business";
import { IUser } from "@/types/users";
import { Business } from "@/types/business";
import { DocumentIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useFormContext, useFieldArray } from "react-hook-form";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { AlertBox } from "@/components/alert/alert-box";
import {
  SUPPLIER_NATIONALITY,
  SUPPLIER_NATIONALITY_OPTIONS,
  SUPPLIER_TYPE_SELLER_OPTIONS,
} from "../constants/supplier.options";
import { RHFPhoneCountrySelect } from "@/components/react-hook-form/rhf-phone-country-select";

function SupplierCreateForm({ handleClose }: { handleClose: () => void }) {
  const {
    watch,
    control,
    setValue,
    formState: { isSubmitting, errors },
  } = useFormContext();
  const useExistingUser = watch("createUserAutomatically") ?? false;
  const useExistingBusiness = watch("useExistingBusiness") ?? false;
  const [selectedUser, setSelectedUser] = React.useState<IUser | null>(null);
  const [selectedBusiness, setSelectedBusiness] =
    React.useState<Business | null>(null);
  const nacionalityType = watch("nacionalityType");

  React.useEffect(() => {
    if (useExistingUser) {
      setValue("name", undefined);
      setValue("email", undefined);
      setValue("phone", undefined);
      setValue("address", undefined);
      setValue("mincexCode", undefined);
      setValue("countryCode", undefined);
      setValue("userMissingEmail", false);
      setValue("userMissingPhone", false);
      setValue("userMissingAddress", false);
      // Limpiar credenciales cuando se usa usuario existente
      setValue("password", undefined);
      setValue("confirmPassword", undefined);
      setValue("requiredPasswordChange", false);
    } else {
      setValue("userId", undefined);
      setSelectedUser(null);
      setValue("userMissingEmail", false);
      setValue("userMissingPhone", false);
      setValue("userMissingAddress", false);
      setValue("name", undefined);
      setValue("email", undefined);
      setValue("phone", undefined);
      setValue("countryCode", undefined);
      setValue("address", undefined);
    }
  }, [useExistingUser, setValue]);

  React.useEffect(() => {
    if (!useExistingBusiness) {
      setValue("businessId", undefined);
      setSelectedBusiness(null);
    }
    // If user switched off existing user, also force business association off
    if (!useExistingUser && useExistingBusiness) {
      setValue("useExistingBusiness", false);
      setValue("businessId", undefined);
      setSelectedBusiness(null);
    }
  }, [useExistingBusiness, useExistingUser, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });
  const { hasPermission } = usePermissions();
  const hasCreate = hasPermission([PERMISSION_ENUM.CREATE]);

  return (
    <>
      <div className="space-y-8">
        <div className="space-y-3">
          <RHFSwitch
            name="createUserAutomatically"
            label="Usar usuario existente"
          />
          {useExistingUser && (
            <>
              <RHFAutocompleteFetcherInfinity
                name="userId"
                label="Usuario existente"
                placeholder="Buscar usuario por nombre, email o teléfono..."
                onFetch={getAllUsers}
                objectValueKey="id"
                objectKeyLabel="name"
                params={{ pageSize: 20 }}
                onOptionSelected={(option: any) => {
                  if (option && option.id) {
                    console.log(option);

                    setValue("userId", option.id);
                    setSelectedUser(option);
                    setValue("name", option.name);
                    if (option.emails && option.emails.length > 0) {
                      setValue("email", option.emails[0].address);
                    }
                    setValue("userMissingEmail", !option.hasEmail);
                    setValue("userMissingPhone", !option.hasPhoneNumber);
                    setValue(
                      "userMissingAddress",
                      !(option.addresses && option.addresses.length > 0)
                    );
                  }
                }}
              />
              {selectedUser && (
                <div className="mt-2 flex items-center gap-3 p-2 border rounded bg-gray-50 dark:bg-gray-800">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {selectedUser.name
                      ? selectedUser.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : String(selectedUser.id)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                      {selectedUser.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {selectedUser.emails[0]?.address ??
                        selectedUser.phones[0]?.number ??
                        ""}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto text-sm text-red-600 hover:underline"
                    onClick={() => {
                      setValue("userId", undefined);
                      setValue("userMissingEmail", false);
                      setValue("userMissingPhone", false);
                      setValue("userMissingAddress", false);
                      setSelectedUser(null);
                    }}
                  >
                    Quitar
                  </button>
                </div>
              )}
              {selectedUser &&
                (() => {
                  const needEmail = !selectedUser.hasEmail;
                  const needPhone = !selectedUser.hasPhoneNumber;
                  const needAddress = !(
                    selectedUser.addresses && selectedUser.addresses.length > 0
                  );
                  const needName = !selectedUser.name;
                  if (!needEmail && !needPhone && !needAddress && !needName)
                    return null;
                  return (
                    <div className="mt-3 p-3 border rounded bg-white dark:bg-gray-900">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Completar información del usuario
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {needName && (
                          <RHFInputWithLabel
                            name="name"
                            label="Nombre"
                            placeholder="Nombre del usuario"
                            required
                          />
                        )}
                        {needPhone && (
                          <RHFPhoneCountrySelect
                            countryFieldName="countryCode"
                            countryValueKey="id"
                            phoneFieldName="phone"
                          />
                        )}
                        {needAddress && (
                          <RHFInputWithLabel
                            name="address"
                            label="Dirección"
                            placeholder="Calle, Ciudad, País"
                            type="textarea"
                            required
                            rows={2}
                          />
                        )}
                      </div>
                    </div>
                  );
                })()}
            </>
          )}
        </div>

        {!useExistingUser && (
          <div className="space-y-4">
            <RHFInputWithLabel
              name="name"
              label="Nombre del Proveedor"
              placeholder="Ej: Proveedor ABC S.A."
              autoFocus
              maxLength={100}
            />
            <RHFInputWithLabel
              name="email"
              label="Email"
              placeholder="contacto@proveedor.com"
              type="email"
              required
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
                countryValueKey="id"
                phoneFieldName="phone"
              />
            </div>

            {/*   <RHFInputWithLabel
              name="phone"
              label="Teléfono"
              type="tel"
              placeholder="+1234567890"
              maxLength={20}
              required
              onCountryChange={(countryCode) => {
                setValue("countryCode", countryCode ?? "");
              }}
            /> */}
            {/* Password fields for new user creation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <RHFInputWithLabel
                name="password"
                label="Contraseña"
                type="password"
                placeholder="Mínimo 8 caracteres"
                required
              />
              <RHFInputWithLabel
                name="confirmPassword"
                label="Confirmar Contraseña"
                type="password"
                placeholder="Repite la contraseña"
                required
              />
            </div>
            <RHFSwitch
              name="requiredPasswordChange"
              label="Requerir cambio de contraseña en el primer inicio de sesión"
            />
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
        )}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Negocio (opcional)
            </label>
          </div>
          <div className="opacity-100">
            <RHFSwitch
              name="useExistingBusiness"
              label="Asociar negocio existente"
              disabled={!useExistingUser}
            />
            {!useExistingUser && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Activa primero &quot;Usar usuario existente&quot; para poder
                asociar un negocio.
              </p>
            )}
          </div>
          {useExistingBusiness && (
            <>
              <RHFAutocompleteFetcherInfinity
                name="businessId"
                label="Seleccionar negocio"
                placeholder="Buscar negocio por nombre o código..."
                onFetch={getAllBusiness}
                objectValueKey="id"
                objectKeyLabel="name"
                params={{ pageSize: 20 }}
                onOptionSelected={(option: any) => {
                  if (option && option.id) {
                    setValue("businessId", option.id);
                    setSelectedBusiness(option);
                  }
                }}
              />
              {selectedBusiness && (
                <div className="mt-2 flex items-center gap-3 p-2 border rounded bg-gray-50 dark:bg-gray-800">
                  <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-700 flex items-center justify-center text-sm font-semibold text-blue-700 dark:text-blue-200">
                    {selectedBusiness.code ||
                      selectedBusiness.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                      {selectedBusiness.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {selectedBusiness.code}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto text-sm text-red-600 hover:underline"
                    onClick={() => {
                      setValue("businessId", undefined);
                      setSelectedBusiness(null);
                    }}
                  >
                    Quitar
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RHFSelectWithLabel
            name="sellerType"
            label="Tipo de vendedor"
            options={SUPPLIER_TYPE_SELLER_OPTIONS}
            placeholder="Seleccionar..."
            required
            variant="custom"
          />
          <RHFSelectWithLabel
            name="nacionalityType"
            label="Nacionalidad"
            options={SUPPLIER_NATIONALITY_OPTIONS}
            placeholder="Seleccionar..."
            required
            variant="custom"
          />
        </div>
        {[SUPPLIER_NATIONALITY.Ambos, SUPPLIER_NATIONALITY.Extranjero].includes(
          Number(nacionalityType)
        ) && (
          <RHFInputWithLabel
            name="mincexCode"
            label="Código Mincex"
            placeholder="Ingresa el código Mincex"
            type="text"
            required
          />
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Documentos
            </label>
            {hasCreate && (
              <button
                type="button"
                onClick={() => append({ fileName: "", content: undefined })}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <PlusIcon className="size-4" />
                Agregar Documento
              </button>
            )}
          </div>
          {fields.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <DocumentIcon className="size-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No hay documentos agregados
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Haz clic en “Agregar Documento” para comenzar
              </p>
            </div>
          )}
          {errors?.documents?.message && (
            <AlertBox
              message={errors?.documents?.message as string}
              title="Error"
              variant="danger"
            />
          )}
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Documento #{index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  <TrashIcon className="size-4" />
                  Eliminar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <RHFInputWithLabel
                  name={`documents.${index}.fileName`}
                  label="Nombre del archivo"
                  placeholder="Ej: Certificado_Calidad.pdf"
                  maxLength={100}
                />
                <RHFFileUpload
                  name={`documents.${index}.content`}
                  label="Archivo"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  maxSize={10 * 1024 * 1024}
                  placeholder="Seleccionar documento"
                />
              </div>
            </div>
          ))}
          {fields.length > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Formatos aceptados: PDF, DOC, DOCX, JPG, JPEG, PNG (máx. 10MB por
              archivo)
            </div>
          )}
        </div>
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
        {hasCreate && (
          <LoaderButton
            type="submit"
            loading={isSubmitting}
            className="btn btn-primary "
          >
            Crear Proveedor
          </LoaderButton>
        )}
      </div>
    </>
  );
}

export default SupplierCreateForm;
