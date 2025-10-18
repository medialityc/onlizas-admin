import AutoBreadcrumbs from "@/components/breadcrumbs/auto-breadcrumbs";
import UserEditForm from "@/sections/users/edit/user-edit-form";
import { getUserById } from "@/services/users";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Usar datos mock para metadata igual que en la lista de usuarios
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
    title: `Editar ${user.data.firstName} - ZAS Admin`,
    description: `Editar información del usuario ${user.data.firstName} ${user.data.lastName}`,
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
        finalLabelOverride="Editar usuario"
      />

      <UserEditForm initialData={user} />
    </div>
  );
}

export default UserEditPage;
