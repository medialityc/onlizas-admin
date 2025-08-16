"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/cards/card";
import InputWithLabel from "@/components/input/input-with-label";
import {
  BuildingOfficeIcon,
  IdentificationIcon,
  GlobeAltIcon,
  CalendarIcon,
  MapPinIcon,
  SparklesIcon,
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
          <h2 className="font-bold">Datos Comerciales</h2>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <IdentificationIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  RUC/NIT
                </span>
              </div>
              <InputWithLabel
                id="ruc"
                onChange={() => {}}
                label=""
                value="20123456789"
                disabled
              />
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
                value="www.techsupply.com"
                disabled
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPinIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dirección Principal
                </span>
              </div>
              <InputWithLabel
                id="address"
                onChange={() => {}}
                label=""
                value="Av. Tecnología 123, Distrito Empresarial, Lima, Perú"
                disabled
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <BuildingOfficeIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tipo de Negocio
                </span>
              </div>
              <InputWithLabel
                id="business-type"
                onChange={() => {}}
                label=""
                value="Distribución de Tecnología"
                disabled
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Año de Fundación
                </span>
              </div>
              <InputWithLabel
                id="foundation-year"
                onChange={() => {}}
                label=""
                value="2008"
                disabled
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
