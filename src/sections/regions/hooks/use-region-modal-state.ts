"use client";

import { useState } from "react";

interface ModalState {
  open: boolean;
  id?: number|string;
}

type MutationCreate<T = any> = (data: T) => Promise<any>;
type MutationUpdate<T = any> = (id: number|string, data: T) => Promise<any>;
type MutationDelete = (id: number|string) => Promise<any>;

interface UseRegionModalOptions<T = any> {
  onCreate?: MutationCreate<T>;
  onUpdate?: MutationUpdate<T>;
  onDelete?: MutationDelete;
}

export function useRegionModalState<T = any>(options?: UseRegionModalOptions<T>) {
  const [modals, setModals] = useState<Record<string, ModalState>>({
    create: { open: false },
    edit: { open: false },
    view: { open: false },
    configure: { open: false },
    
  });

  const [submitting, setSubmitting] = useState(false);

  const openModal = (type: "create" | "edit" | "view" | "configure", id?: number|string) => {
    setModals(prev => ({
      ...prev,
      [type]: { open: true, id }
    }));
  };

  const closeModal = (type: "create" | "edit" | "view" | "configure") => {
    setModals(prev => ({
      ...prev,
      [type]: { open: false, id: undefined }
    }));
  };

  const getModalState = (type: "create" | "edit" | "view" | "configure") => modals[type];

  async function submitCreate(data: T) {
    if (!options?.onCreate) return null;
    try {
      setSubmitting(true);
      const res = await options.onCreate(data);
      // default behavior: close create modal after success
      closeModal("create");
      return res;
    } finally {
      setSubmitting(false);
    }
  }

  async function submitUpdate(id: number|string, data: T) {
    if (!options?.onUpdate) return null;
    try {
      setSubmitting(true);
      const res = await options.onUpdate(id, data);
      // default behavior: close edit modal after success
      closeModal("edit");
      return res;
    } finally {
      setSubmitting(false);
    }
  }

  async function submitDelete(id: number|string) {
    if (!options?.onDelete) return null;
    try {
      setSubmitting(true);
      const res = await options.onDelete(id);
      // keep caller in charge of closing if desired
      return res;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    getModalState,
    openModal,
    closeModal,
    submitCreate,
    submitUpdate,
    submitDelete,
    submitting,
  };
}
