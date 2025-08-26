"use client";

import React, { useCallback, useState } from "react";
import {
  InformationCircleIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/button/button";
import TabsWithIcons from "@/components/tab/tabs";
import IconSettings from "@/components/icon/icon-settings";
import { PersonalInfoTab } from "../components/tab/personal-info-tab";
import { AccountSettingsTab } from "../components/tab/account-settings-tab";
import VendorRequestsTab from "../components/tab/vendor-requests-tab";
import { SearchParams } from "@/types/fetch/request";
import { useUserProfile } from "@/hooks/react-query/use-user-profile";
import { ProfileSkeleton } from "@/sections/provider-management/profile/components/profile-skeleton";
import { PersonalInfoFormData } from "../schemas/personal-info-schema";
import { AccountSettingsFormData } from "../schemas/account-settings-schema";
import { useAuth } from "@/auth-sso/hooks/use-auth";

interface ProfileContainerProps {
  query: SearchParams;
}

export default function ProfileContainer({ query }: ProfileContainerProps) {
  const { user: id } = useAuth();
  const { data: user, isLoading, error } = useUserProfile(id?.id);
  console.log(id);

  if (isLoading) {
    return <ProfileSkeleton />;
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
        </div>

        <TabsWithIcons
          tabs={[
            {
              label: "Información General",
              icon: <InformationCircleIcon className="h-5 w-5" />,
              content: <PersonalInfoTab user={user ? user : null} />,
            },

            {
              label: "Información Comercial",
              icon: <IconSettings className="h-5 w-5" />,
              content: <AccountSettingsTab user={user ? user : null} />,
            },
            {
              label: "Solicitudes de Aprobación",
              icon: <ClipboardDocumentIcon className="h-5 w-5" />,
              content: <VendorRequestsTab user={user ? user : null} />,
            },
          ]}
        />
      </div>
    </div>
  );
}
