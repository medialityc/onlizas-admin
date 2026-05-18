"use client";

import { useRouter } from "next/navigation";
import BrandForm from "./brand-form";

interface WelcomeBrandFormSectionProps {
  afterCreateRedirectTo: string;
}

export function WelcomeBrandFormSection({
  afterCreateRedirectTo,
}: WelcomeBrandFormSectionProps) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-lg">
      <BrandForm
        onSuccess={() => router.push(afterCreateRedirectTo)}
        onCancel={() => router.push("/dashboard")}
        submitLabel="Guardar marca y continuar"
      />
    </div>
  );
}
