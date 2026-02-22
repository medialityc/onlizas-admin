"use client";

import { useRouter } from "next/navigation";
import { MeWarehouseForm } from "../components/warehouse-form/me-warehouse-form";
import { MeWarehouseFormData } from "../schemas/me-warehouse-schema";

interface WelcomeMeWarehouseFormSectionProps {
  afterCreateRedirectTo: string;
}

export function WelcomeMeWarehouseFormSection({
  afterCreateRedirectTo,
}: WelcomeMeWarehouseFormSectionProps) {
  const router = useRouter();

  const handleClose = () => {
    router.push(afterCreateRedirectTo);
  };

  const initialValues: MeWarehouseFormData | undefined = undefined;

  return <MeWarehouseForm warehouse={initialValues} onClose={handleClose} />;
}
