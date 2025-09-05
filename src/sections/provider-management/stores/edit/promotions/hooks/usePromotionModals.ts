import { useState, useCallback } from "react";
import { Promotion } from "@/types/promotions";

/**
 * Hook para la gestión de modales
 * Centraliza el estado y lógica de todos los modales
 */
export function usePromotionModals() {
  // Estados de modales
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  // Estados de entidades seleccionadas
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [promotionToDelete, setPromotionToDelete] = useState<number | null>(null);

  // Handlers para abrir modales
  const openCreateModal = useCallback(() => {
    setEditingPromotion(null);
    setCreateModalOpen(true);
  }, []);

  const openEditModal = useCallback((promotion: Promotion) => {
    setEditingPromotion(promotion);
    setCreateModalOpen(true);
  }, []);

  const openDetailsModal = useCallback((promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setDetailsModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((promotionId: number) => {
    setPromotionToDelete(promotionId);
    setDeleteModalOpen(true);
  }, []);

  // Handlers para cerrar modales
  const closeCreateModal = useCallback(() => {
    setCreateModalOpen(false);
    setEditingPromotion(null);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedPromotion(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setPromotionToDelete(null);
  }, []);

  return {
    // Estados
    createModalOpen,
    detailsModalOpen,
    deleteModalOpen,
    selectedPromotion,
    editingPromotion,
    promotionToDelete,
    
    // Handlers para abrir
    openCreateModal,
    openEditModal,
    openDetailsModal,
    openDeleteModal,
    
    // Handlers para cerrar
    closeCreateModal,
    closeDetailsModal,
    closeDeleteModal,
  };
}
