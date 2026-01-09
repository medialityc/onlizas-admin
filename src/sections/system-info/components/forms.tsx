"use client";

import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSwitch from "@/components/react-hook-form/rhf-switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AddressFormData,
  EmailFormData,
  NumberFormData,
  SocialNetworkFormData,
  addressSchema,
  emailSchema,
  numberSchema,
  socialNetworkSchema,
} from "../schemas/schemas";
import LoaderButton from "@/components/loaders/loader-button";

export function AddressForm({
  defaultValues,
  onSubmit,
  submitting,
}: {
  defaultValues?: AddressFormData;
  onSubmit: (data: AddressFormData) => void;
  submitting?: boolean;
}) {
  const form = useForm({
    defaultValues: { isActive: true, ...defaultValues },
    resolver: zodResolver(addressSchema),
  });
  return (
    <FormProvider
      methods={form}
      onSubmit={form.handleSubmit(onSubmit)}
      id="address-form"
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RHFInputWithLabel
          name="address"
          label="Dirección"
          placeholder="Calle Principal 123"
        />
        <RHFInputWithLabel name="city" label="Ciudad" />
        <RHFInputWithLabel name="state" label="Provincia/Estado" />
        <RHFInputWithLabel name="country" label="País" />
        <RHFInputWithLabel name="postalCode" label="Código Postal" />
        <RHFInputWithLabel name="phone" label="Teléfono" />
        <div className="flex items-end">
          <RHFSwitch name="isActive" label="Activo" />
        </div>
      </div>
      <div className="flex justify-end">
        <LoaderButton type="submit" form="address-form" loading={!!submitting}>
          Guardar
        </LoaderButton>
      </div>
    </FormProvider>
  );
}

export function SocialNetworkForm({
  defaultValues,
  onSubmit,
  submitting,
}: {
  defaultValues?: SocialNetworkFormData;
  onSubmit: (data: SocialNetworkFormData) => void;
  submitting?: boolean;
}) {
  const form = useForm({
    defaultValues: { isActive: true, ...defaultValues },
    resolver: zodResolver(socialNetworkSchema),
  });
  return (
    <FormProvider
      methods={form}
      onSubmit={form.handleSubmit(onSubmit)}
      id="social-form"
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RHFInputWithLabel
          name="platform"
          label="Plataforma"
          placeholder="Facebook"
        />
        <RHFInputWithLabel name="url" label="URL" placeholder="https://..." />
        <RHFInputWithLabel
          name="username"
          label="Usuario"
          placeholder="@onlizas"
        />
        <div className="flex items-end">
          <RHFSwitch name="isActive" label="Activo" />
        </div>
      </div>
      <div className="flex justify-end">
        <LoaderButton type="submit" form="social-form" loading={!!submitting}>
          Guardar
        </LoaderButton>
      </div>
    </FormProvider>
  );
}

export function NumberForm({
  defaultValues,
  onSubmit,
  submitting,
}: {
  defaultValues?: NumberFormData;
  onSubmit: (data: NumberFormData) => void;
  submitting?: boolean;
}) {
  const form = useForm({
    defaultValues: { isActive: true, isWhatsApp: false, ...defaultValues },
    resolver: zodResolver(numberSchema),
  });
  return (
    <FormProvider
      methods={form}
      onSubmit={form.handleSubmit(onSubmit)}
      id="number-form"
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RHFInputWithLabel
          name="phoneNumber"
          label="Número"
          placeholder="+53 7 123 4567"
        />
        <RHFInputWithLabel name="label" label="Etiqueta" placeholder="Ventas" />
        <RHFInputWithLabel
          name="countryCode"
          label="Código País"
          placeholder="+53"
        />
        <RHFInputWithLabel
          name="extension"
          label="Extensión"
          placeholder="101"
        />
        <div className="flex items-end">
          <RHFSwitch name="isWhatsApp" label="WhatsApp" />
        </div>
        <div className="flex items-end">
          <RHFSwitch name="isActive" label="Activo" />
        </div>
      </div>
      <div className="flex justify-end">
        <LoaderButton type="submit" form="number-form" loading={!!submitting}>
          Guardar
        </LoaderButton>
      </div>
    </FormProvider>
  );
}

export function EmailForm({
  defaultValues,
  onSubmit,
  submitting,
}: {
  defaultValues?: EmailFormData;
  onSubmit: (data: EmailFormData) => void;
  submitting?: boolean;
}) {
  const form = useForm({
    defaultValues: { isActive: true, ...defaultValues },
    resolver: zodResolver(emailSchema),
  });
  return (
    <FormProvider
      methods={form}
      onSubmit={form.handleSubmit(onSubmit)}
      id="email-form"
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RHFInputWithLabel
          name="email"
          label="Correo"
          placeholder="contacto@onlizas.com"
        />
        <RHFInputWithLabel
          name="label"
          label="Etiqueta"
          placeholder="Contacto"
        />
        <div className="flex items-end">
          <RHFSwitch name="isActive" label="Activo" />
        </div>
      </div>
      <div className="flex justify-end">
        <LoaderButton type="submit" form="email-form" loading={!!submitting}>
          Guardar
        </LoaderButton>
      </div>
    </FormProvider>
  );
}
