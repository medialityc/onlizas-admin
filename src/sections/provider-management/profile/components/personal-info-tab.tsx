"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/cards/card";
import InputWithLabel from "@/components/input/input-with-label";
import { User } from "@/auth-sso/types";
import Image from "next/image";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  SparklesIcon,
  IdentificationIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import StatusBadge from "@/components/badge/status-badge";
import { IUser } from "@/types/users";

interface PersonalInfoTabProps {
  user: IUser | null;
  isEditing?: boolean;
}

export function PersonalInfoTab({
  user,
  isEditing = false,
}: PersonalInfoTabProps) {
  const emails = user?.emails ?? [];
  const phones = user?.phones ?? [];

  return (
    <Card className="border rounded-lg dark:border-gray-800">
      <CardHeader>
        <div className="mb-3 flex items-center gap-2">
          <SparklesIcon className="h-5 w-5" />
          <h2 className="font-bold">Información básica</h2>
        </div>
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user?.photoUrl ? (
              <Image
                src={user.photoUrl}
                alt={user.name || "avatar"}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <UserCircleIcon className="w-8 h-8 text-gray-500 dark:text-gray-300" />
              </div>
            )}
          </div>

          {/* Título con nombre */}
          <div>
            <CardTitle className="text-2xl font-bold">
              {user?.name || "Usuario"}
            </CardTitle>
            <CardDescription>
              <div className="mt-2">
                <StatusBadge
                  isActive={true}
                  activeText="Proveedor verificado"
                  inactiveText="No verificado"
                />
              </div>
            </CardDescription>
          </div>
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
                  Nombre
                </span>
              </div>
              <InputWithLabel
                id="name"
                onChange={() => {}}
                placeholder={`${user?.name ? "" : "Usuario"}`}
                label=""
                value={user?.name || ""}
                disabled
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <BriefcaseIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rol
                </span>
              </div>
              <InputWithLabel
                id="role"
                onChange={() => {}}
                label=""
                placeholder={`${user ? "" : "Sin registrar"}`}
                value={user?.name || "-"}
                disabled
              />
            </div>

            {/* Emails */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <EnvelopeIcon className="h-4 w-4" />
                Emails
              </label>
              <div className="space-y-2">
                {emails.length === 0 ? (
                  <InputWithLabel
                    id="no-email"
                    onChange={() => {}}
                    label=""
                    value="Sin emails registrados"
                    disabled
                  />
                ) : (
                  emails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <InputWithLabel
                        id={`email-${index}`}
                        onChange={() => {}}
                        label={`Email ${index + 1}`}
                        value={email.address}
                        disabled
                        className="flex-1"
                      />
                      <StatusBadge
                        isActive={!!email.isVerified}
                        activeText="Ver"
                        inactiveText="No"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            {/* Teléfonos */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <PhoneIcon className="h-4 w-4" />
                Teléfonos
              </label>
              <div className="space-y-2">
                {phones.length === 0 ? (
                  <InputWithLabel
                    id="no-phone"
                    onChange={() => {}}
                    label=""
                    value="Sin teléfonos registrados"
                    disabled
                  />
                ) : (
                  phones.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <InputWithLabel
                        id={`phone-${index}`}
                        onChange={() => {}}
                        label={`Teléfono ${index + 1}`}
                        value={phone.number}
                        disabled
                        className="flex-1"
                      />
                      <StatusBadge
                        isActive={!!phone.isVerified}
                        activeText="Ver"
                        inactiveText="No"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
