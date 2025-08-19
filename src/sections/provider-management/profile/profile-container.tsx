"use client";

import React, { useEffect, useState } from "react";
import { PencilIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/button/button";
import TabsWithIcons from "@/components/tab/tabs";
import IconSettings from "@/components/icon/icon-settings";
import { PersonalInfoTab } from "./components/personal-info-tab";
import { AccountSettingsTab } from "./components/account-settings-tab";
import { SearchParams } from "@/types/fetch/request";
import { useUserProfile } from "@/hooks/react-query/use-user-profile";
import { ProfileSkeleton } from "@/sections/provider-management/profile/components/profile-skeleton";
// modal components removed - editing is inline
import FormProvider from "@/components/react-hook-form/form-provider";
import { mockUser } from "./mock-user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser } from "@/services/users";
import { useQueryClient } from "@tanstack/react-query";
import LoaderButton from "@/components/loaders/loader-button";
import {
  providerProfileSchema,
  defaultProviderProfileForm,
  type ProviderProfileFormData,
} from "./profile-schema";
import { getMockBusinessById } from "./mock-businesses";
import { Business } from "@/types/business";
import { IUser } from "@/types/users";
import { useBusiness } from "./edit/hook/use-business";

interface ProfileContainerProps {
  query: SearchParams;
}

export default function ProfileContainer({ query }: ProfileContainerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { data: user, isLoading, error } = useUserProfile();
  const { data: business } = useBusiness(user?.id);
  // user is the data source used to render the form. When the real user
  // is not available (and not loading), use the local mock for testing.

  /* const business: Business[] =
    (user?.businesses ?? [])
      .map((b: any) => {
        if (!b) return null;
        if (typeof b === "object" && b?.id && b?.name) return b as Business;
        const id = typeof b === "number" ? b : b?.id;
        return id ? getMockBusinessById(id) : null;
      })
      .filter((b): b is Business => b !== null) || [];*/
  const queryClient = useQueryClient();
  console.log(user);
  console.log(business);

  // Helper: build initial values from a user-like source
  const buildInitialValues = (source: IUser): ProviderProfileFormData => ({
    id: source?.id,
    name: source?.name || "",
    photo: source?.photoUrl || undefined,
    emails: Array.isArray(source?.emails)
      ? source.emails.map((e: any) => ({
          address: e.address,
          isVerified: !!e.isVerified,
        }))
      : [],
    phones: Array.isArray(source?.phones)
      ? source.phones.map((p: any) => ({
          countryId: Number(p.countryId ?? 0),
          number: String(p.number ?? ""),
          isVerified: !!p.isVerified,
        }))
      : [],
    addresses: Array.isArray(source?.addresses)
      ? source.addresses.map((a: any) => ({
          id: a.id,
          name: a.name ?? "",
          mainStreet: a.mainStreet ?? "",
          number: a.number ?? "",
          city: a.city ?? "",
          state: a.state ?? "",
          zipcode: a.zipcode ?? "",
          countryId: Number(a.countryId ?? 0),
          otherStreets: a.otherStreets ?? "",
          latitude: typeof a.latitude === "number" ? a.latitude : undefined,
          longitude: typeof a.longitude === "number" ? a.longitude : undefined,
          annotations: a.annotations ?? "",
        }))
      : [],
    isBlocked: !!source?.isBlocked,
    isVerified: !!source?.isVerified,
    attributes: source?.attributes || {},
    businesses: Array.isArray(source?.businesses)
      ? source.businesses.map((b: any) =>
          b && typeof b === "object"
            ? { id: b.id, name: b.name, code: b.code }
            : { id: b }
        )
      : [],
    beneficiaries: Array.isArray(source?.beneficiaries)
      ? source.beneficiaries
      : [],
  });

  // Form setup to control both tabs when editing. Use provider profile schema
  const methods = useForm<ProviderProfileFormData>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: buildInitialValues(user ? user : ({} as IUser)),
    mode: "onChange",
  });

  // submit handler shared by form and header Save button
  const onSubmit = async (data: ProviderProfileFormData) => {
    console.log(data);

    const currentUser = user;
    if (!currentUser?.id) return;
    try {
      // If we're showing the mock user (no real `user`), don't call the API.
      // Instead reset the form with merged values and exit editing mode so
      // the UI can be tested locally without touching the backend.
      if (!user) {
        // merge defaults + mock + submitted changes and reset the form
        setIsEditing(false);
        console.info("Saved to mock user (no backend call)");
        return;
      }

      await updateUser(user.id, data);
      queryClient.invalidateQueries({ queryKey: ["user", "profile", "me"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      methods.reset(buildInitialValues(currentUser));
    }
  };

  /* useEffect(() => {
    if (isLoading) return;
    const source = user ?? mockUser;
    methods.reset(buildInitialValues(source));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]); */

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="">
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dark dark:text-white-light">
                Mi Perfil
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <PencilIcon className="h-4 w-4" />
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    outline
                    onClick={() => {
                      // Reset to the current active source (real user or mock)
                      const source = user;
                      methods.reset(
                        buildInitialValues(source ? user : ({} as IUser))
                      );
                      setIsEditing(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <LoaderButton
                    type="submit"
                    loading={methods.formState.isSubmitting}
                    onClick={methods.handleSubmit(onSubmit)}
                  >
                    Guardar
                  </LoaderButton>
                </>
              )}
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
                    user={user ? user : null}
                  />
                ),
              },
              {
                label: "Información Comercial",
                icon: <IconSettings className="h-5 w-5" />,
                content: (
                  <AccountSettingsTab
                    isEditing={isEditing}
                    user={user ? user : null}
                    business={business ? business : []}
                  />
                ),
              },
            ]}
          />
        </FormProvider>
      </div>
    </div>
  );
}
