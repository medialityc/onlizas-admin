import AutoBreadcrumbs from "@/components/breadcrumbs/auto-breadcrumbs";
import { getUserById } from "@/services/users";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import UserDetailsModal from "@/sections/users/details/user-details";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const p = await params;
  const id = p.id;
  const user = await getUserById(id);
  if (!user || user.error || !user.data) {
    return {
      title: "Usuario no encontrado",
      description: "El usuario solicitado no existe",
    };
  }

  return {
    title: `Usuario ${user.data.firstName} - ZAS Admin`,
    description: `Detalles del usuario ${user.data.firstName} ${user.data.lastName}`,
  };
}

async function UserEditPage({ params }: PageProps) {
  const p = await params;
  const id = p.id;
  const data = await getUserById(id);
  if (!data || data.error || !data.data) {
    notFound();
  }
  const user = data.data;
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <AutoBreadcrumbs
        segmentOverrides={{ [id]: `${user.firstName} ${user.lastName}`.trim() }}
        finalLabelOverride="Detalles de usuario"
      />

      {/* Render read-only details (keeps modal-like component but rendered inline) */}
      <div>
        <UserDetailsModal user={user} open={true} onClose={() => {}} />
      </div>
    </div>
  );
}

export default UserEditPage;
