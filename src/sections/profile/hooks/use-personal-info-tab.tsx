import showToast from "@/config/toast/toastConfig";
import { resendEmail, resendPhone } from "@/services/users";
import { useMemo } from "react";
import {
  PersonalInfoFormData,
  personalInfoSchema,
} from "../schemas/personal-info-schema";
import { AddressFormData as UserAddressFormData } from "@/sections/users/user-schema";

import { useFieldArray, useForm } from "react-hook-form";
import { UserResponseMe } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProviderPersonalInfo } from "./use-update-provider-personal-info";
import { useModalState } from "@/hooks/use-modal-state";
import { AddressFormData } from "../components/edit/user-edit-schema";

interface Props {
  user: UserResponseMe | null;
}

//Objetivo del Hook: Separar lógica del Tab al Servidor / Refrescar Cliente
export function usePersonalInfoTab({ user }: Props) {
  // Modal state
  const { getModalState, openModal, closeModal } = useModalState();
  const createAddressModal = getModalState("createAddress");
  const editAddressModal = getModalState<number>("editAddress");
  // Hook para actualizar información personal del proveedor
  const updateProviderMutation = useUpdateProviderPersonalInfo(user?.id ?? 0);

  // Form configuration
  const methods = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      id: user?.id,
      name: user?.name || "",
      photoFile: user?.photoUrl || "",
      emails:
        user?.emails?.map((e: any) => ({
          address: e.address,
          isVerified: !!e.isVerified,
        })) || [],
      phones:
        user?.phones?.map((p: any) => ({
          countryId: Number(p.countryId ?? 0),
          number: String(p.number ?? ""),
          isVerified: !!p.isVerified,
        })) || [],
      addresses:
        user?.addresses?.map((a: AddressFormData) => ({
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
        })) || [],
      isBlocked: !!user?.isBlocked,
      isVerified: !!user?.isVerified,
    },
    mode: "onChange",
  });

  const { control, watch } = methods;
  const emailWatch = watch("emails") || [];
  const phoneWatch = watch("phones") || [];

  // Field arrays
  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({ control, name: "emails" });

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({ control, name: "phones" });

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
    update: updateAddress,
  } = useFieldArray({ control, name: "addresses", keyName: "_key" });

  type PersonalAddress = PersonalInfoFormData["addresses"][number];
  const toPersonalAddress = (a: UserAddressFormData): PersonalAddress => ({
    id: a.id,
    name: a.name,
    mainStreet: a.mainStreet,
    number: a.number,
    city: a.city ?? "",
    state: a.state ?? "",
    zipcode: a.zipcode ?? "",
    countryId: a.countryId ?? 0,
    otherStreets: a.otherStreets ?? "",
    latitude: a.latitude,
    longitude: a.longitude,
    annotations: a.annotations ?? "",
  });

  const handleResendEmail = async (email: string) => {
    if (!email) return;
    try {
      const res = await resendEmail({ email });
      if (res?.error) {
        showToast(res.message || "Error al enviar el correo", "error");
      } else {
        showToast("Correo de verificación enviado correctamente", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Error al enviar la verificación", "error");
    }
  };

  const handleResendPhone = async (phone: any) => {
    if (!phone) return;
    try {
      const response = await resendPhone({
        countryId: phone.countryId || 1,
        phoneNumber: phone.number || phone,
      });
      if (response?.error) {
        showToast(
          response.message || "Error al enviar la verificación",
          "error"
        );
      } else {
        showToast("Verificación enviada correctamente", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Error al enviar la verificación", "error");
    }
  };

  const handleRemoveEmail = (index: number) => removeEmail(index);

  const handleRemovePhone = (index: number) => removePhone(index);

  const handleAddressModalSave = (address: UserAddressFormData) => {
    const editIndex = editAddressModal.id ?? null;
    if (editIndex !== null) {
      updateAddress(editIndex, toPersonalAddress(address));
      closeModal("editAddress");
    } else {
      const withId = { ...address, id: Date.now() } as UserAddressFormData;
      appendAddress(toPersonalAddress(withId));
      closeModal("createAddress");
    }
  };

  const handleEditAddress = (_address: any, index: number) => {
    openModal<number>("editAddress", index);
  };

  // Selected address by index when editing
  const selectedAddress = useMemo(() => {
    const idx = editAddressModal.id;
    if (idx === undefined || idx === null) return null;
    return (addressFields[idx] as unknown as UserAddressFormData) ?? null;
  }, [editAddressModal, addressFields]);

  const handleFormSubmit = async (data: PersonalInfoFormData) => {
    updateProviderMutation.mutate(data);
  };

  return {
    methods,
    control,
    watch,
    emailFields,
    appendEmail,
    removeEmail,
    phoneFields,
    appendPhone,
    removePhone,
    addressFields,
    appendAddress,
    removeAddress,
    updateAddress,
    selectedAddress,
    createAddressModal,
    editAddressModal,
    openModal,
    closeModal,
    getModalState,
    handleResendEmail,
    handleResendPhone,
    handleRemoveEmail,
    handleRemovePhone,
    handleAddressModalSave,
    handleEditAddress,
    handleFormSubmit,
    updateProviderMutation,
    emailWatch,
    phoneWatch,
    toPersonalAddress,
  };
}
