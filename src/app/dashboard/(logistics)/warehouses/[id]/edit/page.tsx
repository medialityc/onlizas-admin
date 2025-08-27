import WarehouseEditContainer from "@/sections/warehouses/containers/warehouse-edit-general-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar almacén - ZAS Express",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

type Props = {
  params: Promise<{ id: string }>;
};
export default async function EditWarehousePage({ params }: Props) {
  const { id } = await params;

  return <WarehouseEditContainer id={id} />;
}
