import BrandCreateFormContainer from "@/sections/brands/containers/brand-create-form.container";
import BrandForm from "@/sections/brands/components/brand-form";
import { getBrandById } from "@/services/brands";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar Marca - ZAS Admin",
  description: "Editar la marca seleccionada",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBrandPage({ params }: PageProps) {
  const { id } = await params;
  const res = await getBrandById(id);
  if (res.error || !res.data) {
    throw new Error(res.message);
  }
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          Editar Marca
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Actualiza los datos de la marca
        </p>
      </div>
      <BrandForm initValue={{ id: res.data.id, name: res.data.name }} />
    </div>
  );
}
