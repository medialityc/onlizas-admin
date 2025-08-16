"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/cards/card";
import InputWithLabel from "@/components/input/input-with-label";
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

interface AccountSettingsTabProps {
  user: IUser | null;
  isEditing?: boolean;
}

export function AccountSettingsTab({
  user,
  isEditing = false,
}: AccountSettingsTabProps) {
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
                {!user?.businesses || user.businesses.length === 0 ? (
                  <InputWithLabel
                    id="no-business"
                    onChange={() => {}}
                    label=""
                    value="Sin negocios asociados"
                    disabled
                  />
                ) : (
                  user.businesses.map((business, index) => (
                    <InputWithLabel
                      key={business.id}
                      id={`business-${index}`}
                      onChange={() => {}}
                      label={`${business.name}`}
                      value={`Código: ${business.code}`}
                      disabled
                    />
                  ))
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <GlobeAltIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sitio Web
                </span>
              </div>
              <InputWithLabel
                id="website"
                onChange={() => {}}
                label=""
                value="www.miproveedora.com"
                disabled
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPinIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dirección Comercial
                </span>
              </div>
              <InputWithLabel
                id="commercial-address"
                onChange={() => {}}
                label=""
                value={
                  user?.addresses && user.addresses.length > 0
                    ? `${user.addresses[0].mainStreet} ${user.addresses[0].number}, ${user.addresses[0].city}`
                    : "Sin dirección comercial registrada"
                }
                disabled
              />
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
                ) : (
                  user.beneficiaries
                    .slice(0, 3)
                    .map((beneficiary, index) => (
                      <InputWithLabel
                        key={beneficiary.id}
                        id={`beneficiary-${index}`}
                        onChange={() => {}}
                        label={`Beneficiario ${index + 1}`}
                        value={beneficiary.name}
                        disabled
                      />
                    ))
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheckIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Benefactor
                </span>
              </div>
              <InputWithLabel
                id="benefactor"
                onChange={() => {}}
                label=""
                value={user?.benefactor?.name || "Sin benefactor asignado"}
                disabled
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <EyeIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Configuración Comercial
                </span>
              </div>
              <div className="space-y-2">
                <InputWithLabel
                  id="api-access"
                  onChange={() => {}}
                  label="Acceso API"
                  value={user?.apiRole || "Sin acceso API"}
                  disabled
                />
                <InputWithLabel
                  id="attributes-count"
                  onChange={() => {}}
                  label="Atributos personalizados"
                  value={
                    user?.attributes && Object.keys(user.attributes).length > 0
                      ? `${Object.keys(user.attributes).length} configurado(s)`
                      : "Sin configuraciones adicionales"
                  }
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
