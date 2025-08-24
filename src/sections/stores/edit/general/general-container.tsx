"use client";

import React from "react";
import { Store } from "@/types/stores";
import GeneralStatusCard from "./components/general-status-card";
import BasicInfoCard from "./components/basic-info-card";
import ContactInfoCard from "./components/contact-info-card";
import PoliciesCard from "./components/policies-card";

interface Props {
  store: Store;
}

export default function GeneralContainer({ store }: Props) {
  // Los valores iniciales ya vienen desde defaultValues en el contenedor principal.
  // Este tab no altera datos de otros tabs ni resetea el formulario global.

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
