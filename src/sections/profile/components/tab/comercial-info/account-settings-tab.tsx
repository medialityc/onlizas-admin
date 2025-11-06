"use client";

import { Card, CardHeader, CardContent } from "@/components/cards/card";
import InputWithLabel from "@/components/input/input-with-label";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormProvider from "@/components/react-hook-form/form-provider";
import {
  BuildingOfficeIcon,
  IdentificationIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { IUser, UserResponseMe } from "@/types/users";
import ProviderBusinessModalContainer from "../../business/provider-business-modal-container";
import BeneficiaryModal from "../../modal/beneficiary-modal";
import { Business } from "@/types/business";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  AccountSettingsFormData,
  accountSettingsSchema,
} from "../../../schemas/account-settings-schema";
import { useMemo, useState, useEffect } from "react";
import { useModalState } from "@/hooks/use-modal-state";
import { useBusiness } from "../../edit/hook/use-business";
import { Button } from "@/components/button/button";
import DeleteDialog from "@/components/modal/delete-modal";
import { useProviderBusinessDeleteMutation } from "../../../hooks/use-provider-business-delete-mutation";
import { AccountingBusinessSkeleton } from "./components/accounting-skeleton";

interface AccountSettingsTabProps {
  user: UserResponseMe | null;
}

export function AccountSettingsTab({ user }: AccountSettingsTabProps) {
  const { getModalState, openModal, closeModal } = useModalState();
  const createBusinessModal = getModalState("createBusiness");
  const editBusinessModal = getModalState<number>("editBusiness");
  const deleteBusinessModal = getModalState<number>("deleteBusiness");
  const { data: business, isLoading } = useBusiness();

  // Hook para eliminar business
  const deleteBusinessMutation = useProviderBusinessDeleteMutation({
    userId: user?.id,
    onSuccess: () => {
      closeModal("deleteBusiness");
    },
  });

  const [selectedBeneficiaryIndex, setSelectedBeneficiaryIndex] = useState<
    number | null
  >(null);

  const [beneficiaryModalOpen, setBeneficiaryModalOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any | null>(
    null
  );

  // Independent form for account settings only
  const methods = useForm<AccountSettingsFormData>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      businesses: [],
      beneficiaries: Array.isArray(user?.beneficiaries)
        ? user.beneficiaries
        : [],
    },
    mode: "onChange",
  });

  const { control, reset, setValue } = methods;

  // Sincronizar businessFields con los datos del servidor
  useEffect(() => {
    if (business && business.length > 0) {
      const formattedBusinesses = business.map((b: Business) => ({
        id: b.id,
        name: b.name,
        code: b.code,
      }));
      reset({
        businesses: formattedBusinesses,
      });
    } else {
      reset({
        businesses: [],
      });
    }
  }, [business]);

  const {
    fields: beneficiaryFields,
    append: appendBeneficiary,
    remove: removeBeneficiary,
    update: updateBeneficiary,
  } = useFieldArray({ control, name: "beneficiaries", keyName: "_key" });
  //
  const selectedBusiness = useMemo(() => {
    const id = editBusinessModal.id;
    if (!id) return undefined;
    const ext = (business || []).find((b) => b.id == id);
    return ext || undefined;
  }, [editBusinessModal, business]);

  // Business seleccionado para eliminar
  const businessToDelete = useMemo(() => {
    const id = deleteBusinessModal.id;
    if (!id) return undefined;
    return (business || []).find((b) => b.id == id);
  }, [deleteBusinessModal, business]);

  // Función para confirmar eliminación
  const handleConfirmDelete = () => {
    if (businessToDelete?.id) {
      deleteBusinessMutation.mutate(businessToDelete.id);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(() => {})}>
      <Card className="border rounded-lg dark:border-gray-800">
        <CardHeader>
          <div className="mb-3 flex items-center gap-2 w-full">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5" />
              <h2 className="font-bold">Información Comercial</h2>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda - Negocios y comercial */}
            <div className="space-y-4">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <BuildingOfficeIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Negocios Asociados
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="space-y-2">
                    {isLoading ? (
                      <AccountingBusinessSkeleton />
                    ) : business && business.length > 0 ? (
                      business.map((b, index) => (
                        <div
                          key={`${b.id}-${index}`}
                          className="flex items-center gap-2"
                        >
                          <RHFInputWithLabel
                            name={`businesses.${index}.name`}
                            //label={b.name || `Negocio ${index + 1}`}
                            defaultValue={b.name}
                          />
                          <button
                            type="button"
                            className="p-1.5 rounded-full text-sky-600 hover:bg-sky-600/10 transition"
                            onClick={() => {
                              if (b?.id) {
                                openModal<number|string>("editBusiness", b.id);
                              }
                            }}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="p-1.5 rounded-full text-red-400 hover:bg-red-600/10 hover:text-red-700 transition"
                            onClick={() => {
                              if (b?.id) {
                                openModal<number|string>("deleteBusiness", b.id);
                              }
                            }}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <InputWithLabel
                        id="business"
                        onChange={() => {}}
                        label=""
                        value="Sin negocios asociados"
                        disabled
                      />
                    )}

                    {/* Botón para agregar nuevo negocio */}
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="secondary"
                        outline
                        size="sm"
                        onClick={() => openModal("createBusiness")}
                        className="flex items-center gap-2 w-auto px-4 py-2"
                      >
                        <PlusIcon className="h-4 w-4" />
                        Agregar Negocio
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Beneficiarios y relaciones comerciales */}
            <div className="space-y-4">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <IdentificationIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Beneficiarios
                  </span>
                </div>
                <div className="space-y-2">
                  {beneficiaryFields && beneficiaryFields.length > 0 ? (
                    beneficiaryFields.map((b, index) => (
                      <div
                        key={b._key ?? `${b.id}-${index}`}
                        className="flex items-center gap-2"
                      >
                        <RHFInputWithLabel
                          name={`beneficiaries.${index}.name`}
                          label={`Beneficiario ${index + 1}`}
                        />
                        <button
                          type="button"
                          className="p-1.5 rounded-full text-red-400 hover:bg-red-600/10 hover:text-red-700 transition self-center"
                          onClick={() => removeBeneficiary(index)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <InputWithLabel
                      id="no-beneficiaries"
                      onChange={() => {}}
                      label=""
                      value="Sin beneficiarios registrados"
                      disabled
                    />
                  )}

                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      outline
                      size="sm"
                      onClick={() => setBeneficiaryModalOpen(true)}
                      className="flex items-center gap-2 w-auto px-4 py-2"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Agregar Beneficiario
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modales FUERA del FormProvider */}
      <ProviderBusinessModalContainer
        open={createBusinessModal.open || editBusinessModal.open}
        onClose={() => {
          if (editBusinessModal.open) closeModal("editBusiness");
          if (createBusinessModal.open) closeModal("createBusiness");
        }}
        business={selectedBusiness}
        userId={user?.id}
        onSuccess={(data?: Business) => {
          if (editBusinessModal.open) closeModal("editBusiness");
          if (createBusinessModal.open) closeModal("createBusiness");
        }}
      />
      <BeneficiaryModal
        open={beneficiaryModalOpen}
        onClose={() => setBeneficiaryModalOpen(false)}
        initial={selectedBeneficiary}
        onSave={(data) => {
          if (selectedBeneficiaryIndex !== null) {
            updateBeneficiary(selectedBeneficiaryIndex, data);
          } else {
            appendBeneficiary(data);
          }
          setBeneficiaryModalOpen(false);
        }}
      />

      {/* Modal de confirmación de eliminación */}
      <DeleteDialog
        open={deleteBusinessModal.open}
        onClose={() => closeModal("deleteBusiness")}
        onConfirm={handleConfirmDelete}
        loading={deleteBusinessMutation.isLoading}
        title="Eliminar Negocio"
        description={`¿Estás seguro de que quieres eliminar el negocio "${businessToDelete?.name}"?`}
        warningMessage="Esta acción eliminará permanentemente el negocio y toda su información asociada."
      />
    </FormProvider>
  );
}
