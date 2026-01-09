"use client";

import IconTrash from "@/components/icon/icon-trash";
import IconPlus from "@/components/icon/icon-plus";
import { Button } from "@/components/button/button";

export function SectionHeader({
  title,
  onCreate,
  canCreate = true,
}: {
  title: string;
  onCreate: () => void;
  canCreate?: boolean;
}) {
  return (
    <div className="grid sm:grid-cols-[1fr,auto] items-center gap-2 mb-3">
      <h2 className="text-xl font-semibold break-all">{title}</h2>
      {canCreate && (
        <div className="justify-self-end">
          <Button type="button" onClick={onCreate}>
            <span className="flex items-center gap-2">
              <IconPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Añadir</span>
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}

export function SimpleCard({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="panel p-4 flex flex-col gap-2 overflow-hidden">
      <div className="grid sm:grid-cols-[1fr,auto] items-start gap-3">
        <div className="min-w-0">
          <div className="text-sm text-gray-500 break-all">{subtitle}</div>
          <div className="text-base font-medium break-all">{title}</div>
        </div>
        {right && <div className="mt-2 sm:mt-0 justify-self-end">{right}</div>}
      </div>
      {children}
    </div>
  );
}
