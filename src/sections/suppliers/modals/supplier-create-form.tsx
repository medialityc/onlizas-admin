import { usePermissions } from "@/auth-sso/permissions-control/hooks";
import LoaderButton from "@/components/loaders/loader-button";
import {
  RHFFileUpload,
  RHFInputWithLabel,
  RHFSelectWithLabel,
  RHFSwitch,
} from "@/components/react-hook-form";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllUsers } from "@/services/users";
import { IUser } from "@/types/users";
import { DocumentIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

function SupplierCreateForm({ handleClose }: { handleClose: () => void }) {
  const {
    watch,
    control,
    setValue,
    formState: { isSubmitting },
  } = useFormContext();
  const useExisting = watch("useExistingUser") ?? false;
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  useEffect(() => {
    // When switching to existing user, clear manual fields
    if (useExisting) {
      setValue("name", undefined);
      setValue("email", undefined);
      setValue("phone", undefined);
      setValue("address", undefined);
      setValue("mincexCode", undefined);
      // ensure flags initialized
      setValue("userMissingEmail", false);
      setValue("userMissingPhone", false);
      setValue("userMissingAddress", false);
      // keep selectedUser as-is
    } else {
      // When switching off, clear selected userId
      setValue("userId", undefined);
      setValue("userMissingEmail", false);
      setValue("userMissingPhone", false);
      setValue("userMissingAddress", false);
      setSelectedUser(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useExisting]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });
  // Control de permisos
    const { data: permissions = [] } = usePermissions();
    const hasPermission = (requiredPerms: string[]) => {
      return requiredPerms.every(perm => permissions.some(p => p.code === perm));
    };
    const hasCreate = hasPermission(["CREATE_ALL"]);
  

  return (
    <>
      <div className="space-y-4">
        {/* Use existing user toggle */}
        <div>
          <RHFSwitch name="useExistingUser" label="Usar usuario existente" />
        </div>
        {useExisting && (
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
                  setValue("userId", option.id);
                  console.log(option);

                  setSelectedUser(option);
                  // set missing flags for validation
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
                    setValue("userMissingEmail", undefined);
                    setValue("userMissingPhone", undefined);
                    setValue("userMissingAddress", undefined);
                    setSelectedUser(null);
                  }}
                >
                  Quitar
                </button>
              </div>
            )}
            {/* If selected user is missing data, allow completing it */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {needName && (
                        <RHFInputWithLabel
                          name="name"
                          label="Nombre"
                          placeholder="Nombre del usuario"
                          required
                        />
                      )}
                      {needEmail && (
                        <RHFInputWithLabel
                          name="email"
                          label="Email"
                          placeholder="contacto@usuario.com"
                          type="email"
                          required
                        />
                      )}
                      {needPhone && (
                        <RHFInputWithLabel
                          name="phone"
                          label="Teléfono"
                          placeholder="+1234567890"
                          type="tel"
                          required
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
        {!useExisting && (
          <>
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

            <RHFInputWithLabel
              name="phone"
              label="Teléfono"
              type="tel"
              placeholder="+1234567890"
              maxLength={20}
              required
            />
          </>
        )}
        {/* Seller Type */}
        <RHFSelectWithLabel
          name="sellerType"
          label="Tipo de vendedor"
          options={[
            { value: "Mayorista", label: "Mayorista" },
            { value: "Minorista", label: "Minorista" },
            { value: "Ambos", label: "Ambos" },
          ]}
          placeholder="Seleccionar..."
          required
          variant="custom"
        />

        {/* Nacionality Type */}
        <RHFSelectWithLabel
          name="nacionalityType"
          label="Nacionalidad"
          options={[
            { value: "Nacional", label: "Nacional" },
            { value: "Extranjero", label: "Extranjero" },
            { value: "Ambos", label: "Ambos" },
          ]}
          placeholder="Seleccionar..."
          required
          variant="custom"
        />

        {/* Usuario existente (buscar y seleccionar) */}

        {/* Address Input */}
        {!useExisting && (
          <RHFInputWithLabel
            name="address"
            label="Dirección"
            placeholder="Calle Principal 123, Ciudad, País"
            maxLength={200}
            rows={3}
            type="textarea"
            required
          />
        )}
        {/* Mincex Code (conditional) */}
        {watch("nacionalityType") &&
          watch("nacionalityType") !== "Nacional" && (
            <RHFInputWithLabel
              name="mincexCode"
              label="Código Mincex"
              placeholder="Ingresa el código Mincex"
              type="text"
              required
            />
          )}

        {/* Documents Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Documentos
            </label>
            {hasCreate&&
            <button
              type="button"
              onClick={() => append({ fileName: "", content: undefined })}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <PlusIcon className="size-4" />
              Agregar Documento
            </button>}
          </div>

          {fields.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <DocumentIcon className="size-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No hay documentos agregados
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Haz clic en &ldquo;Agregar Documento&rdquo; para comenzar
              </p>
            </div>
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

                <div>
                  <RHFFileUpload
                    name={`documents.${index}.content`}
                    label="Archivo"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    maxSize={10 * 1024 * 1024}
                    placeholder="Seleccionar documento"
                  />
                </div>
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
        {hasCreate&&
        <LoaderButton
          type="submit"
          loading={isSubmitting}
          className="btn btn-primary "
        >
          Crear Proveedor
        </LoaderButton>}
      </div>
    </>
  );
}

export default SupplierCreateForm;
