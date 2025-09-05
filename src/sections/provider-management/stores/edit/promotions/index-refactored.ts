// Exportaciones principales de la refactorización

// Hooks refactorizados
export { usePromotionsData } from './hooks/usePromotionsData';
export { usePromotionsMutations } from './hooks/mutations/usePromotionsMutations';
export { usePromotionFilters } from './hooks/usePromotionFilters';
export { usePromotionModals } from './hooks/usePromotionModals';
export { useInitialLoading } from './hooks/useInitialLoading';

// Componentes refactorizados
export { default as PromotionFilterTabs } from './components/promotion-filter-tabs';
export { default as PromotionSearchInput } from './components/promotion-search-input';
export { default as PromotionFilters } from './components/promotion-filters';
export { default as PromotionList } from './components/promotion-list';
export { default as PromotionTypeCard } from './components/modals/promotion-type-card';
export { default as PromotionTypeSelectorModal } from './components/modals/promotion-type-selector-modal';

// Contenedor refactorizado
export { default as PromotionsContainerRefactored } from './promotions-container';

// Tipos y configuraciones
export * from './types/promotion-types';
