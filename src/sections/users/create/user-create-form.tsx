"use client";
import IconInfoTriangle from "@/components/icon/icon-info-triangle";
import { zodResolver } from "@hookform/resolvers/zod";

import showToast from "@/config/toast/toastConfig";
import { useMemo, useState } from "react";

import { AlertBox } from "@/components/alert/alert-box";
import LoaderButton from "@/components/loaders/loader-button";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { revalidateTagFn } from "@/services/revalidate";
import { createUser } from "@/services/users";
import { CreateUserSchema, createUserSchema } from "./create-user-schema";
import { FormProvider } from "@/components/react-hook-form";
import { useForm } from "react-hook-form";
import { RHFPhoneCountrySelect } from "@/components/react-hook-form/rhf-phone-country-select";

interface Props {
  onSuccess?: () => void;
}

const UserCreateForm = ({ onSuccess }: Props) => {
  const [error, setError] = useState<string | null>(null);

  const currentSchema = useMemo(() => createUserSchema, []);

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(currentSchema),
    mode: "onSubmit" as const,
    reValidateMode: "onChange" as const,
    defaultValues: {
      email: "",
      phoneNumber: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (data: CreateUserSchema) => {
    setError(null);

    const { email, phoneNumber, password, firstName, lastName, countryCode } =
      data;

    try {
      const requestPayload = {
        ...(email ? { email } : {}),
        ...(phoneNumber ? { phoneNumber } : {}),
        ...(countryCode ? { countryCode } : {}),
        password,
        firstName,
        lastName,
      };

      const res = await createUser(requestPayload);

      if (res?.status === 200) {
        onSuccess?.();
        showToast("Usuario creado exitosamente", "success");
        revalidateTagFn("users");
        console.log("USER CREATED", res);
      } else if (res?.status === 409) {
        setError(res?.message ?? "El email o teléfono ya está registrado");
      } else if (res?.error) {
        setError(res.message as string);
      } else {
        const genericError = "Error genérico";
        setError(genericError);
        showToast(genericError, "error");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error genérico";

      setError(errorMessage);
    }
  };

  return (
    <FormProvider
      methods={form}
      onSubmit={onSubmit}
      id="user-form"
      className="space-y-5 dark:text-white"
    >
      <div>
        {error && (
          <AlertBox
            message={error}
            title=""
            variant="danger"
            icon={<IconInfoTriangle />}
          />
        )}
      </div>

      <div className="relative text-white-dark">
        <RHFInputWithLabel
          id="name"
          name="firstName"
          type="text"
          label="Nombre*"
          placeholder="Ingresa tu nombre"
        />
      </div>
      <div className="relative text-white-dark">
        <RHFInputWithLabel
          id="name"
          name="lastName"
          type="text"
          label="Apellido*"
          placeholder="Ingresa tu apellido"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="phoneNumber"
            className="mb-[14px] block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Teléfono <span className="text-danger">*</span>
          </label>
          {/* Country prefix + phone input together (no separation) */}
          <RHFPhoneCountrySelect
            countryFieldName="countryCode"
            countryValueKey="code"
            phoneFieldName="phoneNumber"
          />
        </div>

        <div>
          <RHFInputWithLabel
            label="Email (opcional)"
            id="Email"
            name="email"
            type="text"
            placeholder="Ingresa tu email"
          />
        </div>
      </div>

      <RHFInputWithLabel
        label="Contraseña"
        id="Password"
        placeholder="Ingresa tu contraseña"
        name="password"
        type="password"
      />

      <LoaderButton
        type="submit"
        className="btn btn-primary mt-6! w-full border-0 uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
        disabled={form.formState.isSubmitting}
        loading={form.formState.isSubmitting}
      >
        Crear Usuario
      </LoaderButton>
    </FormProvider>
  );
};

export default UserCreateForm;
