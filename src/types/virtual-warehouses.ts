import { ReactNode, ComponentType } from 'react';

// Tipos para las reglas de notificación
export interface NotificationRules {
  notifyOnEntry: boolean;
  notifyOnExit: boolean;
  notifyBeforeExpiry: boolean;
  daysByforeExpiryAlert: number;
}

// Tipos para las reglas de almacenes virtuales
export interface VirtualWarehouseRules {
  allowsManualInventory: boolean;
  autoTransferAfterDays?: number;
  requiresApprovalToExit: boolean;
  requiresInspection: boolean;
  allowsCrossDocking: boolean;
  priorityLevel: 'low' | 'medium' | 'high';
  notificationRules: NotificationRules;
}

// Tipo para la configuración de subtipos de almacenes virtuales
export interface VirtualWarehouseSubtypeConfig {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  defaultRules: VirtualWarehouseRules;
}

// Tipo para las opciones de select
export interface VirtualSubtypeOption {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

// Tipo para los niveles de prioridad
export interface PriorityLevel {
  id: 'low' | 'medium' | 'high';
  name: string;
  color: string;
}

// Tipo para el registro de subtipos
export type VirtualWarehouseSubtypes = {
  [key: string]: VirtualWarehouseSubtypeConfig;
};
