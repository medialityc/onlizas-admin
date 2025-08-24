"use client";

import { useState } from "react";
import SimpleModal from "@/components/modal/modal";
import { Business } from "@/types/business";
import Image from "next/image";
import {
  TagIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";

interface BusinessDetailsModalProps {
  business: Business;
  open: boolean;
  onClose: () => void;
  loading: boolean;
}

function BusinessGeneralInfo({ business }: { business: Business }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
        <DocumentTextIcon className="size-6 text-primary" />
        Información General
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre (siempre visible) */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon className="size-5 text-green-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Nombre
            </label>
          </div>
          <p className="text-lg text-gray-900 dark:text-white font-medium">
            {business.name}
          </p>
        </div>

        {/* Código (siempre visible) */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon className="size-5 text-blue-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Código
            </label>
          </div>
          <p className="text-lg font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded inline-block">
            {String((business as any).code ?? "")}
          </p>
        </div>
      </div>
    </section>
  );
}

function UsuariosSection({ business }: { business: Business }) {
  const users = (business as any)?.users as Array<any> | undefined;
  if (!users || users.length === 0) return null;

  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4 mt-6">
        <ClipboardDocumentListIcon className="size-6 text-primary" />
        Usuarios
      </h2>
      <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
        <ul className="list-disc pl-6 text-gray-800 dark:text-gray-200">
          {users.map((u, i) => {
            const id = typeof u === "object" ? u.id : u;
            const name =
              typeof u === "object"
                ? (u.name ?? `Usuario ${i + 1}`)
                : String(u);
            return (
              <li key={id ?? i} className="flex items-center gap-2">
                <span className="font-medium">{name}</span>
                {id != null && (
                  <span className="text-xs text-gray-500">#{String(id)}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function NegociosHijosSection({ business }: { business: Business }) {
  const children = (business as any)?.childBusinesses as Array<any> | undefined;
  if (!children || children.length === 0) return null;

  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4 mt-6">
        <BuildingOfficeIcon className="size-6 text-primary" />
        Negocios
      </h2>
      <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
        <ul className="list-disc pl-6 text-gray-800 dark:text-gray-200">
          {children.map((n, i) => {
            const id = typeof n === "object" ? n.id : n;
            const name =
              typeof n === "object"
                ? (n.name ?? `Negocio ${i + 1}`)
                : String(n);
            return (
              <li key={id ?? i} className="flex items-center gap-2">
                <span className="font-medium">{name}</span>
                {id != null && (
                  <span className="text-xs text-gray-500">#{String(id)}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function FotosSection({ business }: { business: Business }) {
  const photos = (business as any)?.photos as string[] | undefined;
  const hasPhotos = Array.isArray(photos) && photos.length > 0;
  const [index, setIndex] = useState(0);

  if (!hasPhotos) return null;

  const safeIndex = Math.min(index, photos!.length - 1);
  const prev = () => setIndex((i) => (i - 1 + photos!.length) % photos!.length);
  const next = () => setIndex((i) => (i + 1) % photos!.length);

  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4 mt-6">
        <PhotoIcon className="size-6 text-primary" />
        Fotos
      </h2>

      <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm md:col-span-2">
        <div className="relative w-full">
          <div className="w-full overflow-hidden rounded-md">
            <Image
              key={photos![safeIndex]}
              src={photos![safeIndex]}
              alt={`Foto ${safeIndex + 1}`}
              width={1200}
              height={800}
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>

          {photos!.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full p-2 shadow"
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full p-2 shadow"
                aria-label="Siguiente"
              >
                ›
              </button>

              <div className="mt-3 flex justify-center gap-2">
                {photos!.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-2 w-2 rounded-full ${i === safeIndex ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
                    aria-label={`Ir a foto ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export function BusinessDetailsModal({
  business,
  open,
  onClose,
  loading,
}: BusinessDetailsModalProps) {
  return (
    <SimpleModal
      title="Detalles del Negocio"
      loading={loading}
      open={open}
      onClose={onClose}
    >
      <div className="p-6 space-y-6">
        <BusinessGeneralInfo business={business} />
        <UsuariosSection business={business} />
        <NegociosHijosSection business={business} />
        <FotosSection business={business} />

        <div className="pt-4 flex justify-end">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}
