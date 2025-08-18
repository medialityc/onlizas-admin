"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/cards/card";
import InputWithLabel from "@/components/input/input-with-label";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { useFormContext } from "react-hook-form";
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
import BusinessModalContainer from "@/sections/business/modals/business-modal-container";
import BeneficiaryModal from "./beneficiary-modal";
import { Business } from "@/types/business";
import { TrashIcon } from "@heroicons/react/24/solid";

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
  const [businessModalOpen, setBusinessModalOpen] = React.useState(false);
  const [selectedBusiness, setSelectedBusiness] = React.useState<any | null>(
    null
  );

  const [beneficiaryModalOpen, setBeneficiaryModalOpen] = React.useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = React.useState<
    any | null
  >(null);
  const methods = useFormContext();
  const { setValue, getValues } = methods;
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
                {business?.length === 0 ? (
                  <InputWithLabel
                    id="no-business"
                    onChange={() => {}}
                    label=""
                    value="Sin negocios asociados"
                    disabled
                  />
                ) : isEditing ? (
                  business?.map((business, index) => (
                    <div key={business.id} className="flex items-center gap-2">
                      <RHFInputWithLabel
                        name={`businesses.${index}.name`}
                        label={business.name}
                      />
                      <button
                        type="button"
                        className="p-1.5 rounded-full text-sky-600 hover:bg-sky-600/10 transition mt-7"
                        onClick={() => {
                          setSelectedBusiness(business ? business : null);
                          setBusinessModalOpen(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="p-1.5 rounded-full text-red-400 hover:bg-red-600/10 hover:text-red-700 transition mt-7"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {business?.map((business) => (
                      <div
                        key={business.id}
                        className="panel p-4 rounded-md border bg-white/80 dark:bg-black"
                      >
                        <div className="flex items-start">
                          <div>
                            <div className="text-sm font-semibold">
                              {business.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Código: {business.code}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                {!user?.beneficiaries || user.beneficiaries.length === 0 ? (
                  <InputWithLabel
                    id="no-beneficiaries"
                    onChange={() => {}}
                    label=""
                    value="Sin beneficiarios registrados"
                    disabled
                  />
                ) : isEditing ? (
                  user.beneficiaries
                    .slice(0, 3)
                    .map((beneficiary, index) => (
                      <RHFInputWithLabel
                        key={beneficiary.id}
                        name={`beneficiaries.${index}.name`}
                        label={`Beneficiario ${index + 1}`}
                      />
                    ))
                ) : (
                  <div className="space-y-2">
                    {user.beneficiaries.slice(0, 3).map((beneficiary) => (
                      <div
                        key={beneficiary.id}
                        className="panel p-3 rounded-md border bg-white/80 dark:bg-black flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-medium">
                            {beneficiary.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {beneficiary.emails && beneficiary.emails.length > 0
                              ? beneficiary.emails
                                  .map((e) => e.address)
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

      <BusinessModalContainer
        open={businessModalOpen}
        onClose={() => setBusinessModalOpen(false)}
        business={selectedBusiness}
        isDetailsView={false}
        onSuccess={() => {
          setBusinessModalOpen(false);
        }}
      />
      <BeneficiaryModal
        open={beneficiaryModalOpen}
        onClose={() => setBeneficiaryModalOpen(false)}
        initial={selectedBeneficiary}
        onSave={(data) => {
          const values = getValues();
          const existing: any[] = Array.isArray(values?.beneficiaries)
            ? [...values.beneficiaries]
            : [];
          const idx = existing.findIndex(
            (b) => b?.id && data?.id && b.id === data.id
          );
          if (idx >= 0) existing[idx] = data;
          else existing.push(data);
          setValue("beneficiaries", existing, {
            shouldDirty: true,
            shouldValidate: true,
          });
          setBeneficiaryModalOpen(false);
        }}
      />
    </Card>
  );
}
