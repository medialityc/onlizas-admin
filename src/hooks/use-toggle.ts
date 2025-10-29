'use client'
import { useCallback, useState } from "react";

interface UseToggleReturn {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  setOpen: (value: boolean) => void;
}

export function useToggle(initial: boolean = false): UseToggleReturn {
  const [open, setOpen] = useState(initial);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen((v) => !v), []);

  return { open, onOpen, onClose, onToggle, setOpen };
}
