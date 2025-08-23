"use client";

import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Store } from "@/types/stores";
import { RHFInputWithLabel } from "@/components/react-hook-form";
import GeneralStatusCard from "./components/general-status-card";
import BasicInfoCard from "./components/basic-info-card";
import ContactInfoCard from "./components/contact-info-card";
import PoliciesCard from "./components/policies-card";

interface Props {
  store: Store;
}

export default function GeneralContainer({ store }: Props) {
  const { reset } = useFormContext();

  useEffect(() => {
    const s = store as any;
    const str = (v: unknown) =>
      v === null || v === undefined ? "" : String(v);

    reset({
      isActive: Boolean(s.isActive ?? true),
      name: str(s.name),
      description: str(s.description),
      url: str(s.url),
      logoStyle: str(s.logoStyle),
      email: str(s.email),
      phoneNumber: str(s.phoneNumber),
      address: str(s.address),
      returnPolicy: str(s.returnPolicy),
      shippingPolicy: str(s.shippingPolicy),
      termsOfService: str(s.termsOfService),
    });
  }, [store, reset]);

  return (
    <div className="space-y-6">
      <GeneralStatusCard />

      {/* Información básica y contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Información Básica */}
        <BasicInfoCard />

        {/* Información de Contacto */}
        <ContactInfoCard />
      </div>

      {/* Políticas de la tienda */}
      <PoliciesCard />
      </div>
  );
}
