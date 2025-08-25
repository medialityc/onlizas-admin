"use client";

import React from "react";
import GeneralStatusCard from "./components/general-status-card";
import BasicInfoCard from "./components/basic-info-card";
import ContactInfoCard from "./components/contact-info-card";
import PoliciesCard from "./components/policies-card";

export default function GeneralContainer() {
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
