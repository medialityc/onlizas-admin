import { useState, useEffect, useCallback } from 'react';

export interface DiscrepancyResolution {
  resolution: string;
  resolvedAt: string;
  quantityAccepted: number;
}

export interface UseDiscrepancyManagementReturn {
  resolvedDiscrepancies: Record<string, DiscrepancyResolution>;
  permanentlyResolvedDiscrepancies: Set<string>;
  isResolvingAll: boolean;
  setResolvedDiscrepancies: React.Dispatch<React.SetStateAction<Record<string, DiscrepancyResolution>>>;
  setPermanentlyResolvedDiscrepancies: React.Dispatch<React.SetStateAction<Set<string>>>;
  setIsResolvingAll: (resolving: boolean) => void;
  addResolvedDiscrepancy: (id: string, resolution: DiscrepancyResolution) => void;
  markAsPermanentlyResolved: (ids: string[]) => void;
  clearResolvedDiscrepancies: () => void;
}

export const useDiscrepancyManagement = (): UseDiscrepancyManagementReturn => {
  const [resolvedDiscrepancies, setResolvedDiscrepancies] = useState<Record<string, DiscrepancyResolution>>({});
  const [permanentlyResolvedDiscrepancies, setPermanentlyResolvedDiscrepancies] = useState<Set<string>>(new Set());
  const [isResolvingAll, setIsResolvingAll] = useState(false);

  const addResolvedDiscrepancy = useCallback((id: string, resolution: DiscrepancyResolution) => {
    setResolvedDiscrepancies(prev => ({
      ...prev,
      [id]: resolution
    }));
  }, []);

  const markAsPermanentlyResolved = useCallback((ids: string[]) => {
    setPermanentlyResolvedDiscrepancies(prev => new Set([...Array.from(prev), ...ids]));
    setResolvedDiscrepancies({});
  }, []);

  const clearResolvedDiscrepancies = useCallback(() => {
    setResolvedDiscrepancies({});
  }, []);

  return {
    resolvedDiscrepancies,
    permanentlyResolvedDiscrepancies,
    isResolvingAll,
    setResolvedDiscrepancies,
    setPermanentlyResolvedDiscrepancies,
    setIsResolvingAll,
    addResolvedDiscrepancy,
    markAsPermanentlyResolved,
    clearResolvedDiscrepancies,
  };
};