import { Metadata } from "next";
import {
  listAddresses,
  listEmails,
  listNumbers,
  listSocialNetworks,
} from "@/services/system-info";
import SystemInfoClient from "@/sections/system-info/system-info.client";

export const metadata: Metadata = {
  title: "Información del Sistema - ZAS Admin",
  description: "Gestiona direcciones, redes sociales, teléfonos y correos",
  icons: { icon: "/assets/images/NEWZAS.svg" },
};

export default async function SystemInfoPage() {
  const [addr, socials, nums, emails] = await Promise.all([
    listAddresses(),
    listSocialNetworks(),
    listNumbers(),
    listEmails(),
  ]);
  if (addr.error || socials.error || nums.error || emails.error) {
    throw new Error(
      addr.message ||
        socials.message ||
        nums.message ||
        emails.message ||
        "Error cargando información"
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Información del Sistema
          </h1>
          <p className="text-muted-foreground mt-1">
            Direcciones, redes sociales, teléfonos y correos
          </p>
        </div>
      </div>
      <SystemInfoClient
        addresses={addr.data || []}
        socials={socials.data || []}
        numbers={nums.data || []}
        emails={emails.data || []}
      />
    </div>
  );
}
