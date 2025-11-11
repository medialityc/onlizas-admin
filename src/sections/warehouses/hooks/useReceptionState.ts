import { useState, useCallback } from 'react';

export interface ReceptionData {
  id: string;
  transferId: string;
  status: string;
  hasDiscrepancies: boolean;
  items: any[];
  comments: any[];
  receivedAt: string;
  notes: string;
}

export interface UseReceptionStateReturn {
  receptionData: ReceptionData | null;
  isReceiving: boolean;
  isReceptionCompleted: boolean;
  setReceptionData: (data: ReceptionData | null) => void;
  setIsReceiving: (loading: boolean) => void;
  setIsReceptionCompleted: (completed: boolean) => void;
  updateReceptionData: (updates: Partial<ReceptionData>) => void;
}

export const useReceptionState = (): UseReceptionStateReturn => {
  const [receptionData, setReceptionData] = useState<ReceptionData | null>(null);
  const [isReceiving, setIsReceiving] = useState(false);
  const [isReceptionCompleted, setIsReceptionCompleted] = useState(false);

  const updateReceptionData = useCallback((updates: Partial<ReceptionData>) => {
    setReceptionData(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  return {
    receptionData,
    isReceiving,
    isReceptionCompleted,
    setReceptionData,
    setIsReceiving,
    setIsReceptionCompleted,
    updateReceptionData,
  };
};