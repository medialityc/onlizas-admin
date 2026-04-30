"use client";

import { useRouter } from "next/navigation";
import { MeWarehouseForm } from "../components/warehouse-form/me-warehouse-form";
import { MeWarehouseFormData } from "../schemas/me-warehouse-schema";
import { WarehouseFormData } from "../schemas/warehouse-schema";

interface WelcomeMeWarehouseFormSectionProps {
  afterCreateRedirectTo: string;
  existingWarehouse?: WarehouseFormData;
}

export function WelcomeMeWarehouseFormSection({
  afterCreateRedirectTo,
  existingWarehouse,
}: WelcomeMeWarehouseFormSectionProps) {
  const router = useRouter();

  const handleClose = () => {
    router.push(afterCreateRedirectTo);
  };

  const existingWarehouseId = Number(existingWarehouse?.id);
  const initialValues: MeWarehouseFormData | undefined = existingWarehouse
    ? {
        id: Number.isNaN(existingWarehouseId) ? undefined : existingWarehouseId,
        name: existingWarehouse.name,
        active: existingWarehouse.active,
        address: {
          name: existingWarehouse.address?.name ?? "Principal",
          mainStreet: existingWarehouse.address?.mainStreet ?? "",
          difficultAccessArea:
            existingWarehouse.address?.difficultAccessArea ?? false,
          number: existingWarehouse.address?.number ?? "",
          otherStreets: existingWarehouse.address?.otherStreets ?? "",
          city: existingWarehouse.address?.city ?? "",
          zipcode: existingWarehouse.address?.zipcode ?? "",
          annotations: existingWarehouse.address?.annotations ?? "",
          districtId: existingWarehouse.address?.districtId,
          stateId: existingWarehouse.address?.stateId,
          countryId: existingWarehouse.address?.countryId,
        },
      }
    : undefined;

  return <MeWarehouseForm warehouse={initialValues} onClose={handleClose} />;
}
