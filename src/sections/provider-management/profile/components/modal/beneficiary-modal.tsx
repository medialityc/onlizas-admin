"use client";

import React, { useEffect } from "react";
import SimpleModal from "@/components/modal/modal";
import { useForm, useFieldArray } from "react-hook-form";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { Button } from "@/components/button/button";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FormProvider } from "@/components/react-hook-form";

interface EmailItem {
  id?: number;
  address: string;
  isVerified?: boolean;
}

interface BeneficiaryForm {
  id?: number;
  name: string;
  emails: EmailItem[];
  phones: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: BeneficiaryForm | null;
  onSave: (data: BeneficiaryForm) => void;
}

export default function BeneficiaryModal({
  open,
  onClose,
  initial,
  onSave,
}: Props) {
  const methods = useForm<BeneficiaryForm>({
    defaultValues: initial || {
      name: "",
      emails: [{ address: "", isVerified: false }],
      phones: [""],
    },
    mode: "onChange",
  });

  const { control, handleSubmit, reset } = methods;

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray<any>({ control: control as any, name: "emails" });
  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray<any>({ control: control as any, name: "phones" });

  useEffect(() => {
    reset(
      initial || {
        name: "",
        emails: [{ address: "", isVerified: false }],
        phones: [""],
      },
    );
  }, [initial, reset]);

  const onSubmit = (data: BeneficiaryForm) => {
    onSave(data);
  };

  if (!open) return null;

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title={initial ? "Editar beneficiario" : "Nuevo beneficiario"}
    >
      <div className="p-4">
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <RHFInputWithLabel name="name" label="Nombre" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Emails</div>
            </div>
            <div className="space-y-2">
              {emailFields.map((ef, i) => (
                <div key={ef.id} className="flex items-center gap-2">
                  <RHFInputWithLabel
                    name={`emails.${i}.address`}
                    label={`Email ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeEmail(i)}
                    className="p-1.5 rounded-full text-red-600 hover:bg-red-600/10 transition"
                    aria-label={`Eliminar email ${i + 1}`}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    appendEmail({
                      id: Date.now(),
                      address: "",
                      isVerified: false,
                    })
                  }
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" /> Añadir email
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Teléfonos</div>
            </div>
            <div className="space-y-2">
              {phoneFields.map((pf, i) => (
                <div key={pf.id} className="flex items-center gap-2">
                  <RHFInputWithLabel
                    name={`phones.${i}`}
                    label={`Tel ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removePhone(i)}
                    className="p-1.5 rounded-full text-red-600 hover:bg-red-600/10 transition"
                    aria-label={`Eliminar teléfono ${i + 1}`}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => appendPhone("")}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" /> Añadir teléfono
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary text-white">
              Guardar
            </Button>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
