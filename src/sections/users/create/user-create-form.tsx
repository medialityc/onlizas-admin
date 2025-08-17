"use client";
import IconInfoTriangle from "@/components/icon/icon-info-triangle";
import { zodResolver } from "@hookform/resolvers/zod";

import IconMail from "@/components/icon/icon-mail";
import IconPhoneCall from "@/components/icon/icon-phone-call";
import showToast from "@/config/toast/toastConfig";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { createUser } from "@/services/users";
import { CreateUserSchema, createUserSchema } from "./create-user-schema";
import TabsWithIcons from "@/components/tab/tabs";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { AlertBox } from "@/components/alert/alert-box";
import LoaderButton from "@/components/loaders/loader-button";
import { RHFCountrySelect } from "@/components/react-hook-form/rhf-country-code-select";

interface Props {
  onSuccess?: () => void;
}

const UserCreateForm = ({ onSuccess }: Props) => {
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [error, setError] = useState<string | null>(null);

  const currentSchema = useMemo(() => {
    const schema = createUserSchema(method);
    return schema;
  }, [method]);

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(currentSchema),
    mode: "onChange" as const,
    reValidateMode: "onChange" as const,
    defaultValues: {
      email: "",
      phoneNumber: "",
      phoneNumberCountryId: -1,
      password: "",
      name: "",
    },
  });

  const changeMethod = (tab: number) => {
    if (tab === 0) {
      setMethod("email");
      form.setValue("phoneNumber", "");
      form.setValue("phoneNumberCountryId", -1);
      setError(null);
    } else {
      setMethod("phone");
      form.setValue("email", "");
      setError(null);
    }
  };

  const onSubmit = async (data: CreateUserSchema) => {
    setError(null);

    const { email, phoneNumber, phoneNumberCountryId, password, name } = data;

    try {
      const requestPayload = {
        email: method === "email" ? email : undefined,
        phoneNumber: method === "phone" ? phoneNumber : undefined,
        phoneNumberCountryId:
          method === "phone" ? phoneNumberCountryId : undefined,
        password,
        name,
      };

      const res = await createUser(requestPayload);

      if (res?.status === 200) {
        // TODO: Actualizar los parametros de la url
        onSuccess?.();
        showToast("Usuario creado exitosamente", "success");
      } else if (res?.status === 409) {
        const conflictMessage =
          method === "email"
            ? "Este email ya está registrado"
            : "Este teléfono ya está registrado";
        setError(conflictMessage);
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
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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

          <div className="relative text-white-dark">
            <RHFInputWithLabel
              id="name"
              name="name"
              type="text"
              label="Nombre"
              placeholder="Ingresa tu nombre"
            />
          </div>
        </div>
        <TabsWithIcons
          handleChange={changeMethod}
          tabs={[
            {
              icon: <IconMail fill={true} />,
              label: "Email",
              content: (
                <>
                  <RHFInputWithLabel
                    label="Email"
                    id="Email"
                    name="email"
                    type="text"
                    placeholder="Ingresa tu email"
                  />
                </>
              ),
            },
            {
              icon: <IconPhoneCall fill={true} />,
              label: "Teléfono",
              content: (
                <div>
                  <p>Teléfono</p>
                  <div className="flex items-center space-x-1">
                    <RHFCountrySelect name="phoneNumberCountryId" />
                    <RHFInputWithLabel
                      className="flex-1 "
                      id="Phone"
                      type="tel"
                      placeholder="Ingresa tu teléfono"
                      name="phoneNumber"
                      showError={false}
                    />
                  </div>
                  {form.formState.errors?.["phoneNumber"]?.message && (
                    <p className="text-xs text-red-500 mt-1">
                      {form.formState.errors?.["phoneNumber"].message}
                    </p>
                  )}
                </div>
              ),
            },
          ]}
        />
        <RHFInputWithLabel
          label="Contraseña"
          id="Password"
          placeholder="Ingresa tu contraseña"
          name="password"
          type="password"
        />

        <LoaderButton
          type="submit"
          className="btn btn-primary text-textColor mt-6! w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          loading={form.formState.isSubmitting}
        >
          Crear Usuario
        </LoaderButton>
      </form>
    </FormProvider>
  );
};

export default UserCreateForm;
