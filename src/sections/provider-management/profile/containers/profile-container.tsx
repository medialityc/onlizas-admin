"use client";

import {
  InformationCircleIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import TabsWithIcons from "@/components/tab/tabs";
import IconSettings from "@/components/icon/icon-settings";
import { PersonalInfoTab } from "../components/tab/personal-info/personal-info-tab";
import { AccountSettingsTab } from "../components/tab/comercial-info/account-settings-tab";
import VendorRequestsTab from "../components/tab/vendor-requests/vendor-requests-tab";

import { useUserProfile } from "@/hooks/react-query/use-user-profile";
import { ProfileSkeleton } from "@/sections/provider-management/profile/components/tab/personal-info/components/profile-skeleton";
import { useSupplierApprovalProcess } from "../hooks/use-supplier-approval-process";

export default function ProfileContainer() {
  const { data: user, isLoading } = useUserProfile();
  const { data: approvalProcess, isLoading: isLoadingApproval } =
    useSupplierApprovalProcess();
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
                  documents={[
                    ...(approvalProcess?.approvedDocuments || []),
                    ...(approvalProcess?.pendingDocuments || []),
                  ]}
                />
              ),
            },

            {
              label: "Información Comercial",
              icon: <IconSettings className="h-5 w-5" />,
              content: <AccountSettingsTab user={user ? user : null} />,
            },
            {
              label: "Solicitudes de Aprobación",
              icon: <ClipboardDocumentIcon className="h-5 w-5" />,
              content: (
                <VendorRequestsTab
                  user={user ? user : null}
                  approvalProcess={approvalProcess ? approvalProcess : null}
                  isLoadingApproval={isLoadingApproval}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
