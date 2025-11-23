# Sidebar Component

Este es un sidebar componentizado y optimizado para la aplicación Onlizas.

## Estructura de Archivos

```
src/layouts/sidebar/
├── index.ts                 # Exportaciones principales
├── sidebar.tsx             # Componente principal del sidebar
├── sidebar-header.tsx      # Header del sidebar (logo + toggle)
├── sidebar-content.tsx     # Contenido scrolleable del sidebar
├── sidebar-section.tsx     # Sección expandible del menú
├── sidebar-item.tsx        # Item individual del menú
├── sidebar-config.tsx      # Configuración del menú
├── use-sidebar.ts          # Hook personalizado para la lógica del sidebar
├── types.ts               # Tipos TypeScript
└── README.md              # Documentación
```

## Componentes

### Sidebar (Principal)

Componente raíz que orquesta todos los demás componentes.

### SidebarHeader

Contiene el logo y el botón de colapso del sidebar.

### SidebarContent

Contenedor principal con scroll que contiene todas las secciones del menú.

### SidebarSection

Sección expandible del menú que contiene múltiples items.

### SidebarItem

Item individual del menú con link e icono.

## Hook personalizado

### useSidebar

Hook que encapsula toda la lógica del sidebar:

- Manejo de secciones expandidas/colapsadas
- Detección de rutas activas
- Efectos de DOM para manejo de clases CSS
- **Auto-expansión de secciones**: La sección que contiene la ruta actual se expande automáticamente
- **Persistencia de preferencias**: Las preferencias del usuario se guardan en localStorage

### useSidebarPreferences

Hook que maneja la persistencia de las preferencias del usuario:

- Guarda y carga el estado de las secciones expandidas desde localStorage
- Proporciona funciones para manipular el estado de las secciones

## Configuración

### sidebar-config.tsx

Contiene la configuración del menú:

- `sidebarSections`: Array con todas las secciones y sus items
- `defaultExpandedSections`: Estado inicial de las secciones

## Tipos

### SidebarMenuItem

```typescript
interface SidebarMenuItem {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
  badge?: {
    text: string;
    color?: "primary" | "success" | "warning" | "danger" | "info";
  };
  disabled?: boolean;
}
```

### SidebarSection

```typescript
interface SidebarSection {
  id: string;
  label: string;
  items: SidebarMenuItem[];
}
```

## Uso

```typescript
import { Sidebar } from '@/layouts/sidebar';

// El componente se usa directamente sin props
<Sidebar />
```

## Ventajas de la Componentización

1. **Separación de responsabilidades**: Cada componente tiene una responsabilidad específica
2. **Reutilización**: Los componentes pueden ser reutilizados en otras partes de la aplicación
3. **Mantenibilidad**: Fácil de mantener y modificar
4. **Testabilidad**: Cada componente puede ser testeado individualmente
5. **Escalabilidad**: Fácil agregar nuevas secciones o funcionalidades
6. **Legibilidad**: Código más limpio y fácil de entender

## Características Mejoradas

### 🎯 Auto-expansión de secciones

- La sección que contiene la ruta actual se expande automáticamente
- Mejora la experiencia del usuario al navegar

### 💾 Persistencia de preferencias

- Las preferencias del usuario se guardan en localStorage
- Mantiene el estado de las secciones entre sesiones

### 🏷️ Soporte para badges

- Los items del menú pueden mostrar badges con información adicional
- Colores personalizables: primary, success, warning, danger, info

### 🚫 Estados deshabilitados

- Los items pueden ser deshabilitados condicionalmente
- Útil para permisos o funcionalidades no disponibles

## Agregar una nueva sección

Para agregar una nueva sección al sidebar, simplemente modifica el archivo `sidebar-config.tsx`:

```typescript
export const sidebarSections: SidebarSection[] = [
  // ...secciones existentes
  {
    id: "nueva-seccion",
    label: "Nueva Sección",
    items: [
      {
        id: "nuevo-item",
        label: "Nuevo Item",
        path: "/nuevo-path",
        icon: <NuevoIcon className="h-5 w-5" />,
      },
    ],
  },
];
```

Y agregar el estado inicial en `defaultExpandedSections`:

```typescript
export const defaultExpandedSections = {
  // ...estados existentes
  "nueva-seccion": false,
};
```
