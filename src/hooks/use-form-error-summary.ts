import { useCallback, useMemo, useState } from "react";
import { FieldErrors } from "react-hook-form";

interface UseFormErrorSummaryProps {
  errors: FieldErrors;
  onTabChange?: (tabIndex: number) => void;
}

export function useFormErrorSummary({ errors, onTabChange }: UseFormErrorSummaryProps) {
  const [isErrorSummaryVisible, setIsErrorSummaryVisible] = useState(true);
  
  // Mapeo de campos a tabs con sus etiquetas descriptivas
  const tabMappings = useMemo(() => ({
    // Tab 0: Información Básica
    name: { tabIndex: 0, tabName: "Información Básica", fieldLabel: "Nombre del Estado" },
    code: { tabIndex: 0, tabName: "Información Básica", fieldLabel: "Código Interno" },
    priority: { tabIndex: 0, tabName: "Información Básica", fieldLabel: "Prioridad" },
    color: { tabIndex: 0, tabName: "Información Básica", fieldLabel: "Color del Estado" },
    icon: { tabIndex: 0, tabName: "Información Básica", fieldLabel: "Icono" },
    
    // Tab 1: Características
    trackingEnabled: { tabIndex: 1, tabName: "Características", fieldLabel: "Seguimiento Habilitado" },
    
    // Tab 2: Configuración SMS
    smsEnabled: { tabIndex: 2, tabName: "Configuración SMS", fieldLabel: "SMS Habilitado" },
    smsTemplate: { tabIndex: 2, tabName: "Configuración SMS", fieldLabel: "Plantilla SMS" },
    recipientSmsTemplate: { tabIndex: 2, tabName: "Configuración SMS", fieldLabel: "Plantilla SMS Destinatario" },
    
    // Tab 3: Configuración Email
    emailEnabled: { tabIndex: 3, tabName: "Configuración Email", fieldLabel: "Email Habilitado" },
    emailTemplate: { tabIndex: 3, tabName: "Configuración Email", fieldLabel: "Plantilla Email" },
    recipientEmailTemplate: { tabIndex: 3, tabName: "Configuración Email", fieldLabel: "Plantilla Email Destinatario" },
  }), []);

  // Obtener errores agrupados por tab
  const errorsByTab = useMemo(() => {
    const grouped: Record<number, number> = {};
    
    Object.entries(errors).forEach(([fieldName, error]) => {
      if (!error?.message) return;
      
      const mapping = tabMappings[fieldName as keyof typeof tabMappings];
      if (!mapping) return;
      
      const { tabIndex } = mapping;
      grouped[tabIndex] = (grouped[tabIndex] || 0) + 1;
    });
    
    return grouped;
  }, [errors, tabMappings]);

  // Manejar clic en un campo del resumen de errores
  const handleFieldClick = useCallback((fieldName: string, tabIndex: number) => {
    // Cambiar al tab correspondiente
    onTabChange?.(tabIndex);
    
    // Hacer scroll al campo con error después de un pequeño delay
    setTimeout(() => {
      const element = document.querySelector(`[name="${fieldName}"]`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Enfocar el elemento si es posible
        if (element instanceof HTMLElement) {
          element.focus();
        }
      }
    }, 100);
  }, [onTabChange]);

  // Verificar si un tab tiene errores
  const hasTabErrors = useCallback((tabIndex: number) => {
    return (errorsByTab[tabIndex] || 0) > 0;
  }, [errorsByTab]);

  // Obtener el número de errores en un tab específico
  const getTabErrorCount = useCallback((tabIndex: number) => {
    return errorsByTab[tabIndex] || 0;
  }, [errorsByTab]);

  // Ocultar el resumen de errores
  const hideErrorSummary = useCallback(() => {
    setIsErrorSummaryVisible(false);
  }, []);

  // Mostrar el resumen de errores
  const showErrorSummary = useCallback(() => {
    setIsErrorSummaryVisible(true);
  }, []);

  return {
    tabMappings,
    errorsByTab,
    hasTabErrors,
    getTabErrorCount,
    handleFieldClick,
    isErrorSummaryVisible,
    hideErrorSummary,
    showErrorSummary,
  };
}
