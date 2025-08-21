"use client";

import React, { useCallback, useState } from "react";
import {
  InformationCircleIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/button/button";
import TabsWithIcons from "@/components/tab/tabs";
import IconSettings from "@/components/icon/icon-settings";
import { PersonalInfoTab } from "./components/personal-info-tab";
import { AccountSettingsTab } from "./components/account-settings-tab-new";
import VendorRequestsTab from "./components/vendor-requests-tab";
import { SearchParams } from "@/types/fetch/request";
import { useUserProfile } from "@/hooks/react-query/use-user-profile";
import { ProfileSkeleton } from "@/sections/provider-management/profile/components/profile-skeleton";
import { updateUser } from "@/services/users";
import { useQueryClient } from "@tanstack/react-query";
import LoaderButton from "@/components/loaders/loader-button";
import { PersonalInfoFormData } from "./schemas/personal-info-schema";
import { AccountSettingsFormData } from "./schemas/account-settings-schema";
import { IUser } from "@/types/users";
import showToast from "@/config/toast/toastConfig";

interface ProfileContainerProps {
  query: SearchParams;
}

export default function ProfileContainer({ query }: ProfileContainerProps) {
  const { data: user, isLoading, error } = useUserProfile();

  // State to hold form data from both tabs
  const [personalInfoData, setPersonalInfoData] =
    useState<PersonalInfoFormData | null>(null);
  const [accountSettingsData, setAccountSettingsData] =
    useState<AccountSettingsFormData | null>(null);

  // Handler for personal info form
  const handlePersonalInfoSave = (data: PersonalInfoFormData) => {
    setPersonalInfoData(data);
    console.log("Personal Info data saved to state:", data);
  };

  // Handler for account settings form
  const handleAccountSettingsSave = (data: AccountSettingsFormData) => {
    setAccountSettingsData(data);
    console.log("Account Settings data saved to state:", data);
  };

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
              content: (
                <PersonalInfoTab
                  user={user ? user : null}
                  onSave={handlePersonalInfoSave}
                />
              ),
            },

            {
              label: "Información Comercial",
              icon: <IconSettings className="h-5 w-5" />,
              content: (
                <AccountSettingsTab
                  user={user ? user : null}
                  onSave={handleAccountSettingsSave}
                />
              ),
            },
            {
              label: "Solicitudes de Aprobación",
              icon: <ClipboardDocumentIcon className="h-5 w-5" />,
              content: <VendorRequestsTab />,
            },
          ]}
        />
      </div>
    </div>
  );
}
