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
  userUpdateSchema,
  defaultUserForm,
  type UserUpdateData,
} from "@/sections/users/edit/components/user-schema";
import { getMockBusinessById } from "./mock-businesses";
import { Business } from "@/types/business";

interface ProfileContainerProps {
  query: SearchParams;
}

export default function ProfileContainer({ query }: ProfileContainerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { data: user, isLoading, error } = useUserProfile();
  // activeUser is the data source used to render the form. When the real user
  // is not available (and not loading), use the local mock for testing.
  const activeUser = user ?? (isLoading ? undefined : mockUser);
  const business: Business[] =
    (activeUser?.businesses ?? [])
      .map((b: any) => {
        if (!b) return null;
        if (typeof b === "object" && b?.id && b?.name) return b as Business;
        const id = typeof b === "number" ? b : b?.id;
        return id ? getMockBusinessById(id) : null;
      })
      .filter((b): b is Business => b !== null) || [];
  const queryClient = useQueryClient();
  console.log(business);

  // Form setup to control both tabs when editing. Use external zod schema and sensible defaults
  const methods = useForm<UserUpdateData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      ...defaultUserForm,
    },
    mode: "onChange",
  });

  // submit handler shared by form and header Save button
  const onSubmit = async (data: UserUpdateData) => {
    const currentUser = activeUser;
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
      methods.reset({
        ...(defaultUserForm as any),
        ...(currentUser as any),
        ...(data as any),
      });
    }
  };

  useEffect(() => {
    // Wait until loading finishes. Then reset the form with either the real
    // user (if present) or the mock user so the form is always populated for
    // local testing.
    if (isLoading) return;
    const source = user ?? mockUser;
    methods.reset({
      ...(defaultUserForm as any),
      ...(source || {}),
      photo: (source as any)?.photoUrl || undefined,
      website: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  // Show skeleton while the profile is loading or if user is not yet available
  /*   if (isLoading || !user) {
    return <ProfileSkeleton />;
  } */

  return (
    <div className="space-y-6">
      <div className="">
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
                    const source = user ?? mockUser;
                    methods.reset({
                      ...(defaultUserForm as any),
                      ...(source || {}),
                    });
                    setIsEditing(false);
                  }}
                >
                  Cancelar
                </Button>
                <LoaderButton
                  type="button"
                  loading={methods.formState.isSubmitting}
                  onClick={methods.handleSubmit(onSubmit)}
                >
                  Guardar
                </LoaderButton>
              </>
            )}
          </div>
        </div>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <TabsWithIcons
            tabs={[
              {
                label: "Información General",
                icon: <InformationCircleIcon className="h-5 w-5" />,
                content: (
                  <PersonalInfoTab
                    isEditing={isEditing}
                    user={activeUser ? activeUser : null}
                  />
                ),
              },
              {
                label: "Información Comercial",
                icon: <IconSettings className="h-5 w-5" />,
                content: (
                  <AccountSettingsTab
                    isEditing={isEditing}
                    user={activeUser ? activeUser : null}
                    business={business}
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
