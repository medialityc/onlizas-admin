"use client";

import { Card, CardHeader, CardContent } from "@/components/cards/card";
import InputWithLabel from "@/components/input/input-with-label";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  BuildingOfficeIcon,
  IdentificationIcon,
  GlobeAltIcon,
  MapPinIcon,
  SparklesIcon,
  ShieldCheckIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { IUser } from "@/types/users";
import ProviderBusinessModalContainer from "./business/provider-business-modal-container";
import BeneficiaryModal from "./beneficiary-modal";
import { Business } from "@/types/business";
import { TrashIcon } from "@heroicons/react/24/solid";
import { ProviderProfileFormData } from "../profile-schema";
import { useMemo, useState } from "react";
import { useModalState } from "@/hooks/use-modal-state";

interface AccountSettingsTabProps {
  user: IUser | null;
  isEditing?: boolean;
  business: Business[] | null;
}

export function AccountSettingsTab({
  user,
  isEditing = false,
  business,
}: AccountSettingsTabProps) {
  const { getModalState, openModal, closeModal } = useModalState();
  const createBusinessModal = getModalState("createBusiness");
  const editBusinessModal = getModalState<number>("editBusiness");
  const [selectedBeneficiaryIndex, setSelectedBeneficiaryIndex] = useState<
    number | null
  >(null);

  const [beneficiaryModalOpen, setBeneficiaryModalOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any | null>(
    null
  );
  const methods = useFormContext<ProviderProfileFormData>();
  const { setValue, getValues } = methods;
  const { control } = methods;

  const {
    fields: businessFields,
    append: appendBusiness,
    remove: removeBusiness,
    update: updateBusiness,
  } = useFieldArray({ control, name: "businesses", keyName: "_key" });

  const {
    fields: beneficiaryFields,
    append: appendBeneficiary,
    remove: removeBeneficiary,
    update: updateBeneficiary,
  } = useFieldArray({ control, name: "beneficiaries", keyName: "_key" });
  console.log(business);

  return (
    <Card className="border rounded-lg dark:border-gray-800">
      <CardHeader>
        <div className="mb-3 flex items-center gap-2">
          <SparklesIcon className="h-5 w-5" />
          <h2 className="font-bold">Información Comercial</h2>
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
                {isEditing ? (
                  <div className="space-y-2">
                    {businessFields && businessFields.length > 0 ? (
                      businessFields.map((b, index) => (
                        <div
                          key={b._key ?? `${b.id}-${index}`}
                          className="flex items-center gap-2"
                        >
                          <RHFInputWithLabel
                            name={`businesses.${index}.name`}
                            label={b.name}
                          />
                          <button
                            type="button"
                            className="p-1.5 rounded-full text-sky-600 hover:bg-sky-600/10 transition mt-7"
                            onClick={() => {
                              if ((b as any)?.id) {
                                openModal<number>("editBusiness", b.id);
                              }
                            }}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="p-1.5 rounded-full text-red-400 hover:bg-red-600/10 hover:text-red-700 transition mt-7"
                            onClick={() => removeBusiness(index)}
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
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm w-full mt-2"
                      onClick={() => {
                        openModal("createBusiness");
                      }}
                    >
                      + Agregar Negocio
                    </button>
                  </div>
                ) : (
                  <InputWithLabel
                    id="business"
                    onChange={() => {}}
                    label=""
                    value={"Sin negocios asociados"}
                    disabled
                  />
                )}
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
                {!user?.beneficiaries ||
                (beneficiaryFields &&
                  beneficiaryFields.length === 0 &&
                  user.beneficiaries.length === 0) ? (
                  <InputWithLabel
                    id="no-beneficiaries"
                    onChange={() => {}}
                    label=""
                    value="Sin beneficiarios registrados"
                    disabled
                  />
                ) : isEditing ? (
                  beneficiaryFields && beneficiaryFields.length > 0 ? (
                    beneficiaryFields.slice(0, 3).map((b, index) => (
                      <div key={(b as any)._key ?? `${(b as any).id}-${index}`}>
                        <RHFInputWithLabel
                          name={`beneficiaries.${index}.name`}
                          label={`Beneficiario ${index + 1}`}
                        />
                      </div>
                    ))
                  ) : (
                    user.beneficiaries
                      .slice(0, 3)
                      .map((beneficiary, index) => (
                        <RHFInputWithLabel
                          key={beneficiary.id}
                          name={`beneficiaries.${index}.name`}
                          label={`Beneficiario ${index + 1}`}
                        />
                      ))
                  )
                ) : (
                  <div className="space-y-2">
                    {(beneficiaryFields && beneficiaryFields.length > 0
                      ? beneficiaryFields
                      : user.beneficiaries
                    )
                      .slice(0, 3)
                      .map((beneficiary: any, idx: number) => (
                        <div
                          key={
                            beneficiary.id ?? (beneficiary as any)._key ?? idx
                          }
                          className="panel p-3 rounded-md border bg-white/80 dark:bg-black flex items-center justify-between"
                        >
                          <div>
                            <div className="text-sm font-medium">
                              {beneficiary.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {beneficiary.emails &&
                              beneficiary.emails.length > 0
                                ? beneficiary.emails
                                    .map((e: any) => e.address)
                                    .join(", ")
                                : "-"}
                            </div>
                          </div>
                          <div />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <ProviderBusinessModalContainer
        open={createBusinessModal.open || editBusinessModal.open}
        onClose={() => {
          if (editBusinessModal.open) closeModal("editBusiness");
          if (createBusinessModal.open) closeModal("createBusiness");
        }}
        business={useMemo(() => {
          const id = editBusinessModal.id;
          if (!id) return undefined;
          const ext = (business || []).find((b) => b.id == id);
          return ext || undefined;
        }, [editBusinessModal, business])}
        userId={user?.id}
        onSuccess={(data?: Business) => {
          if (data?.id) {
            const idx = businessFields.findIndex((b: any) => b.id == data.id);
            if (idx >= 0) updateBusiness(idx, data);
            else appendBusiness(data);
          }
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
    </Card>
  );
}
