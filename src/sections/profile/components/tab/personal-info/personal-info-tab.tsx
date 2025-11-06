"use client";

import { Card, CardHeader, CardContent } from "@/components/cards/card";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { UserResponseMe } from "@/types/users";
import FormProvider from "@/components/react-hook-form/form-provider";
import { usePersonalInfoTab } from "../../../hooks/use-personal-info-tab";
import { EnhancedDocument } from "@/types/suppliers";

// Componentes divididos
import { AvatarSection } from "./components/avatar-section";
import { NameSection } from "./components/name-section";
import { AccountStatusSection } from "./components/account-status-section";
import { EmailsSection } from "./components/emails-section";
import { PhonesSection } from "./components/phones-section";
import { DocumentsSection } from "./components/documents-section";

interface PersonalInfoTabProps {
  user: UserResponseMe | null;
  documents: EnhancedDocument[];
}

export function PersonalInfoTab({ user, documents }: PersonalInfoTabProps) {
  const {
    addressFields,
    appendEmail,
    appendPhone,
    closeModal,
    createAddressModal,
    editAddressModal,
    emailFields,
    handleAddressModalSave,
    handleEditAddress,
    handleFormSubmit,
    handleRemoveEmail,
    handleRemovePhone,
    methods,
    openModal,
    phoneFields,
    removeAddress,
    selectedAddress,
    updateProviderMutation,
  } = usePersonalInfoTab({ user });

  const {
    formState: { errors },
  } = methods;

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleFormSubmit}>
        <Card className="border rounded-lg dark:border-gray-800">
          <CardHeader>
            <div className="mb-3 flex items-center gap-2">
              <SparklesIcon className="h-5 w-5" />
              <h2 className="font-bold">Información básica</h2>
            </div>

            <AvatarSection
              user={user}
              errors={errors}
              isLoading={updateProviderMutation.isPending}
            />
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Row 1: Nombre (left) */}
              <NameSection user={user} errors={errors} />

              {/* Row 1: Estado de la cuenta (right) */}
              <AccountStatusSection user={user} />

              {/* Row 2: Emails - full width */}
              <EmailsSection
                emailFields={emailFields}
                errors={errors}
                appendEmail={appendEmail}
                handleRemoveEmail={handleRemoveEmail}
              />

              {/* Row 3: Direcciones (left) */}
              {/* <AddressesSection
                addressFields={addressFields}
                errors={errors}
                openModal={openModal}
                handleEditAddress={handleEditAddress}
                removeAddress={removeAddress}
              /> */}

              {/* Row 3: Teléfonos (right) */}
              <PhonesSection
                phoneFields={phoneFields}
                errors={errors}
                appendPhone={appendPhone}
                handleRemovePhone={handleRemovePhone}
              />

              {/* Row 4: Documentos - full width and last */}
              <DocumentsSection documents={documents} userId={user?.id ?? 0} />
            </div>
          </CardContent>
        </Card>
      </FormProvider>
    </>
  );
}
