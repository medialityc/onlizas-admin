"use client";

import { useState } from "react";
import SimpleModal from "@/components/modal/modal";
import { SectionHeader, SimpleCard } from "./components/cards";
import {
  Address,
  SystemEmail,
  SystemNumber,
  SocialNetwork,
} from "@/types/system-info";
import {
  AddressForm,
  EmailForm,
  NumberForm,
  SocialNetworkForm,
} from "./components/forms";
import {
  createAddress,
  createEmail,
  createNumber,
  createSocialNetwork,
  deleteAddress,
  deleteEmail,
  deleteNumber,
  deleteSocialNetwork,
  updateAddress,
  updateEmail,
  updateNumber,
  updateSocialNetwork,
} from "@/services/system-info";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import IconTrash from "@/components/icon/icon-trash";
import { Button } from "@/components/button/button";
import { Tooltip } from "@mantine/core";
import ConfirmationDialog from "@/components/modal/confirm-modal";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import showToast from "@/config/toast/toastConfig";

export default function SystemInfoClient({
  addresses,
  socials,
  numbers,
  emails,
}: {
  addresses: Address[];
  socials: SocialNetwork[];
  numbers: SystemNumber[];
  emails: SystemEmail[];
}) {
  const [open, setOpen] = useState<{
    type: "addr" | "social" | "number" | "email" | null;
    id?: string | null;
  }>({ type: null });
  const [editingItem, setEditingItem] = useState<any>(null);
  const [confirm, setConfirm] = useState<{
    open: boolean;
    type?: "addr" | "social" | "number" | "email";
    id?: string;
    title?: string;
    loading?: boolean;
  }>({ open: false });
  const [submitting, setSubmitting] = useState(false);
  const qc = useQueryClient();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission([PERMISSION_ENUM.CREATE]);
  const canUpdate = hasPermission([PERMISSION_ENUM.UPDATE]);
  const canDelete = hasPermission([PERMISSION_ENUM.DELETE]);

  const close = () => {
    setOpen({ type: null });
    setEditingItem(null);
  };
  const openCreate = (type: "addr" | "social" | "number" | "email") => {
    setOpen({ type });
    setEditingItem(null);
  };
  const openEdit = (
    type: "addr" | "social" | "number" | "email",
    item: any,
  ) => {
    setOpen({ type });
    setEditingItem(item);
  };

  const onDeleted = () => {
    qc.invalidateQueries();
  };

  const requestDelete = (
    type: "addr" | "social" | "number" | "email",
    id: string,
    title?: string,
  ) => {
    if (!canDelete) return;
    setConfirm({ open: true, type, id, title });
  };

  const handleConfirmDelete = async () => {
    if (!confirm.type || !confirm.id) return;
    try {
      setConfirm((c) => ({ ...c, loading: true }));
      switch (confirm.type) {
        case "addr":
          await deleteAddress(confirm.id);
          break;
        case "social":
          await deleteSocialNetwork(confirm.id);
          break;
        case "number":
          await deleteNumber(confirm.id);
          break;
        case "email":
          await deleteEmail(confirm.id);
          break;
      }
      setConfirm({ open: false });
      onDeleted();
    } finally {
      setConfirm({ open: false });
    }
  };

  return (
    <div className="space-y-8">
      {/* Addresses */}
      <div>
        <SectionHeader
          title="Direcciones"
          onCreate={() => openCreate("addr")}
          canCreate={canCreate}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {addresses.map((a) => (
            <SimpleCard
              key={a.id}
              title={a.address}
              subtitle={[a.city, a.state, a.country].filter(Boolean).join(", ")}
              right={
                <div className="flex gap-2">
                  {canUpdate && (
                    <Button
                      variant="secondary"
                      onClick={() => openEdit("addr", a)}
                    >
                      Editar
                    </Button>
                  )}
                  {canDelete && (
                    <Tooltip label="Eliminar" withArrow>
                      <Button
                        variant="destructive"
                        onClick={() => requestDelete("addr", a.id, a.address)}
                        aria-label="Eliminar"
                      >
                        <IconTrash className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              }
            >
              <div className="text-xs text-gray-500">{a.phone}</div>
            </SimpleCard>
          ))}
          {addresses.length === 0 && (
            <div className="text-sm text-gray-500">
              No hay direcciones registradas.
            </div>
          )}
        </div>
      </div>

      {/* Social Networks */}
      <div>
        <SectionHeader
          title="Redes Sociales"
          onCreate={() => openCreate("social")}
          canCreate={canCreate}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {socials.map((s) => (
            <SimpleCard
              key={s.id}
              title={`${s.platform} · ${s.username ?? ""}`}
              subtitle={s.url}
              right={
                <div className="flex gap-2">
                  {canUpdate && (
                    <Button
                      variant="secondary"
                      onClick={() => openEdit("social", s)}
                    >
                      Editar
                    </Button>
                  )}
                  {canDelete && (
                    <Tooltip label="Eliminar" withArrow>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          requestDelete("social", s.id, s.platform)
                        }
                        aria-label="Eliminar"
                      >
                        <IconTrash className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              }
            />
          ))}
          {socials.length === 0 && (
            <div className="text-sm text-gray-500">
              No hay redes sociales registradas.
            </div>
          )}
        </div>
      </div>

      {/* Numbers */}
      <div>
        <SectionHeader
          title="Teléfonos"
          onCreate={() => openCreate("number")}
          canCreate={canCreate}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {numbers.map((n) => (
            <SimpleCard
              key={n.id}
              title={`${n.label ?? ""} ${n.isWhatsApp ? "· WhatsApp" : ""}`}
              subtitle={`${n.countryCode ?? ""} ${n.phoneNumber}${n.extension ? " ext." + n.extension : ""}`}
              right={
                <div className="flex gap-2">
                  {canUpdate && (
                    <Button
                      variant="secondary"
                      onClick={() => openEdit("number", n)}
                    >
                      Editar
                    </Button>
                  )}
                  {canDelete && (
                    <Tooltip label="Eliminar" withArrow>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          requestDelete(
                            "number",
                            n.id,
                            n.label ?? n.phoneNumber,
                          )
                        }
                        aria-label="Eliminar"
                      >
                        <IconTrash className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              }
            />
          ))}
          {numbers.length === 0 && (
            <div className="text-sm text-gray-500">
              No hay números registrados.
            </div>
          )}
        </div>
      </div>

      {/* Emails */}
      <div>
        <SectionHeader
          title="Correos"
          onCreate={() => openCreate("email")}
          canCreate={canCreate}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {emails.map((e) => (
            <SimpleCard
              key={e.id}
              title={e.label ?? "Correo"}
              subtitle={e.email}
              right={
                <div className="flex gap-2">
                  {canUpdate && (
                    <Button
                      variant="secondary"
                      onClick={() => openEdit("email", e)}
                    >
                      Editar
                    </Button>
                  )}
                  {canDelete && (
                    <Tooltip label="Eliminar" withArrow>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          requestDelete("email", e.id, e.label ?? e.email)
                        }
                        aria-label="Eliminar"
                      >
                        <IconTrash className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              }
            />
          ))}
          {emails.length === 0 && (
            <div className="text-sm text-gray-500">
              No hay correos registrados.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <SimpleModal
        open={!!open.type}
        onClose={close}
        className="max-w-2xl"
        title={editingItem ? "Editar" : "Crear"}
      >
        <div className="pt-2">
          {open.type === "addr" && (
            <AddressForm
              defaultValues={editingItem ?? undefined}
              submitting={submitting}
              onSubmit={async (data) => {
                try {
                  setSubmitting(true);
                  if (editingItem) {
                    await updateAddress(editingItem.id, data);
                  } else {
                    await createAddress(data);
                  }
                  showToast("Guardado correctamente", "success");
                  close();
                  onDeleted();
                } catch (e: any) {
                  showToast(e?.message || "Error al guardar", "error");
                } finally {
                  setSubmitting(false);
                }
              }}
            />
          )}
          {open.type === "social" && (
            <SocialNetworkForm
              defaultValues={editingItem ?? undefined}
              submitting={submitting}
              onSubmit={async (data) => {
                try {
                  setSubmitting(true);
                  if (editingItem) {
                    await updateSocialNetwork(editingItem.id, data);
                  } else {
                    await createSocialNetwork(data);
                  }
                  showToast("Guardado correctamente", "success");
                  close();
                  onDeleted();
                } catch (e: any) {
                  showToast(e?.message || "Error al guardar", "error");
                } finally {
                  setSubmitting(false);
                }
              }}
            />
          )}
          {open.type === "number" && (
            <NumberForm
              defaultValues={editingItem ?? undefined}
              submitting={submitting}
              onSubmit={async (data) => {
                try {
                  setSubmitting(true);
                  if (editingItem) {
                    await updateNumber(editingItem.id, data);
                  } else {
                    await createNumber(data);
                  }
                  showToast("Guardado correctamente", "success");
                  close();
                  onDeleted();
                } catch (e: any) {
                  showToast(e?.message || "Error al guardar", "error");
                } finally {
                  setSubmitting(false);
                }
              }}
            />
          )}
          {open.type === "email" && (
            <EmailForm
              defaultValues={editingItem ?? undefined}
              submitting={submitting}
              onSubmit={async (data) => {
                try {
                  setSubmitting(true);
                  if (editingItem) {
                    await updateEmail(editingItem.id, data);
                  } else {
                    await createEmail(data);
                  }
                  showToast("Guardado correctamente", "success");
                  close();
                  onDeleted();
                } catch (e: any) {
                  showToast(e?.message || "Error al guardar", "error");
                } finally {
                  setSubmitting(false);
                }
              }}
            />
          )}
        </div>
      </SimpleModal>

      {/* Confirmación de eliminación */}
      <ConfirmationDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false })}
        onConfirm={handleConfirmDelete}
        actionType="delete"
        title={
          confirm.type === "addr"
            ? "¿Eliminar dirección?"
            : confirm.type === "social"
              ? "¿Eliminar red social?"
              : confirm.type === "number"
                ? "¿Eliminar teléfono?"
                : confirm.type === "email"
                  ? "¿Eliminar correo?"
                  : "¿Eliminar?"
        }
        description={
          confirm.title
            ? `Se eliminará "${confirm.title}" permanentemente.`
            : "Esta acción eliminará el elemento seleccionado."
        }
        loading={!!confirm.loading}
      />
    </div>
  );
}
