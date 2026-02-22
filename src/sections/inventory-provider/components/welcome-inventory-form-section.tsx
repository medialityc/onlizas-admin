"use client";

import InventoryProviderForm from "./inventory-form/inventory-form-container";

interface WelcomeInventoryFormSectionProps {
  providerId: string;
  afterCreateRedirectTo: string;
}

export function WelcomeInventoryFormSection({
  providerId,
  afterCreateRedirectTo,
}: WelcomeInventoryFormSectionProps) {
  // En el flujo guiado no necesitamos cerrar un modal, solo avanzar.
  // Usamos un onClose no-op para satisfacer la API del formulario.
  const handleClose = () => {
    // no-op en modo welcome
  };

  return (
    <InventoryProviderForm
      provider={providerId}
      forProvider
      onClose={handleClose}
      afterCreateRedirectTo={afterCreateRedirectTo}
    />
  );
}
