"use client";

import React from "react";
import GeneralStatusCard from "./components/general-status-card";
import BasicInfoCard from "./components/basic-info-card";
import PoliciesCard from "./components/policies-card";

export default function GeneralContainer() {
  return (
    <div className="space-y-6">
      <GeneralStatusCard />

      {/* Información básica y contacto */}
      <BasicInfoCard />

      {/* Políticas de la tienda */}
      <PoliciesCard />
    </div>
  );
}
