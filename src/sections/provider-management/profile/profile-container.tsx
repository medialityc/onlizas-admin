"use client";

import React, { useState } from "react";
import { PencilIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/button/button";
import TabsWithIcons from "@/components/tab/tabs";
import IconSettings from "@/components/icon/icon-settings";
import { PersonalInfoTab } from "./components/personal-info-tab";
import { AccountSettingsTab } from "./components/account-settings-tab";
import { SearchParams } from "@/types/fetch/request";
import { useUserProfile } from "@/hooks/react-query/use-user-profile";
import { ProfileSkeleton } from "@/sections/provider-management/profile/components/profile-skeleton";
import { useSimpleQuery } from "@/hooks/react-query/use-simple-query";
import { fetchUserMe } from "@/services/users";
import { useAuth } from "@/auth-sso/hooks/use-auth";

interface ProfileContainerProps {
  query: SearchParams;
}

export default function ProfileContainer({ query }: ProfileContainerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { tokens } = useAuth();

  // Hook para obtener datos del usuario
  const {
    data: user,
    isLoading,
    error,
  } = useSimpleQuery([query], () => fetchUserMe(tokens?.accessToken));

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !user?.data) {
    return (
      <div className="space-y-6">
        <div className="">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dark dark:text-white-light">
                Mi Perfil
              </h2>
            </div>
          </div>

          <div className="panel">
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Información no disponible
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No se pudo cargar la información del perfil en este momento.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Intentar nuevamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-dark dark:text-white-light">
              Mi Perfil
            </h2>
          </div>
          <div>
            <Button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <PencilIcon className="h-4 w-4" />
              {isEditing ? "Cancelar Edición" : "Editar Perfil"}
            </Button>
          </div>
        </div>

        <TabsWithIcons
          tabs={[
            {
              label: "Información General",
              icon: <InformationCircleIcon className="h-5 w-5" />,
              content: (
                <PersonalInfoTab
                  isEditing={isEditing}
                  user={user.data ? user.data : null}
                />
              ),
            },
            {
              label: "Configuración",
              icon: <IconSettings className="h-5 w-5" />,
              content: (
                <AccountSettingsTab
                  isEditing={isEditing}
                  user={user.data ? user.data : null}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
