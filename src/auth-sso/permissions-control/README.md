# permissions-control

Módulo para obtener y verificar permisos del usuario autenticado usando server actions y hooks de React Query.

## Objetivo

Centralizar la lógica de acceso a los endpoints de permisos del backend ("/api/me/permissions") y ofrecer:

- Server functions seguras (`fetchMyPermissions`, `checkPermission`) que usan la sesión interna.
- Hooks cliente reutilizables (`usePermissions`, `usePermissionCheck`) con manejo de cache, revalidación y estados de carga/error.
- Definición de endpoints en un único lugar (`ENDPOINTS`).

## Estructura de archivos

```
permissions-control/
  ├── lib.ts        # Constantes de endpoints
  ├── server.ts     # Server functions ("use server") que hablan con el API protegido
  ├── hooks.ts      # Hooks cliente basados en React Query
  └── README.md
```

## Tipos

### `Permission`

Representa un permiso asociado al rol del usuario:

```ts
interface Permission {
  id: number;
  name: string;
  code: string;
  description: string;
  entity: string;
  type: number;
  roleId: number;
  roleName: string;
  roleCode: string;
}
```

## Endpoints (`lib.ts`)

Archivo: `lib.ts`

```ts
export const ENDPOINTS = {
  permissions: "https://api.zasdistributor.com/api/me/permissions",
  check: (code: string) =>
    `https://api.zasdistributor.com/api/me/permissions/${encodeURIComponent(code)}/check`,
};
```

Descripción:

- `permissions`: Obtiene la lista completa de permisos del usuario autenticado.
- `check(code)`: Verifica si el usuario posee el permiso identificado por `code`.

## Server Functions (`server.ts`)

Archivo con el pragma `"use server"` para ejecutarse exclusivamente en el lado del servidor.

### Dependencias internas

- `getSession()` (importado desde `../services/server-actions`): Recupera la sesión y los tokens para autorización.
- `authHeaders(token)`: Helper privado que agrega el header `Authorization` si existe un token.

### `fetchMyPermissions()`

Trae todos los permisos del usuario actual.

- Método: `GET ENDPOINTS.permissions`
- Headers: `Authorization: Bearer <accessToken>`
- Cache: `no-store` (evita cache SSR/edge para siempre obtener datos frescos)
- Errores:
  - 401 -> `Unauthorized`
  - Otros códigos no 2xx -> lanza error con detalle del status.
- Retorno: `Promise<Permission[]>`

### `checkPermission(code: string)`

Verifica un permiso puntual.

- Método: `GET ENDPOINTS.check(code)`
- Respuestas manejadas:
  - 200 -> `true` (permiso concedido)
  - 403 -> `false` (permiso denegado)
  - 401 -> lanza `Unauthorized`
  - 400 -> intenta parsear `{ detail }` del body y lanza error
  - Otros -> lanza error genérico con status
- Retorno: `Promise<boolean>`

## Hooks Cliente (`hooks.ts`)

Basados en `@tanstack/react-query`.

### `usePermissions(options?)`

Obtiene y cachea la lista de permisos.

- `queryKey`: `['permissions', 'me']`
- `staleTime` default: 60s
- Parámetros opcionales: `{ enabled?: boolean; staleTime?: number }`
- Usa internamente `fetchMyPermissions()`.
- Retorna el objeto estándar de React Query (`data`, `isLoading`, `error`, etc.).

### `usePermissionCheck(code, options?)`

Chequea un permiso puntual de forma reactiva.

- `queryKey`: `['permission', 'check', code]`
- No ejecuta si `code` es `undefined` o vacío.
- `staleTime` default: 30s
- Parámetros opcionales: `{ enabled?: boolean; refetchInterval?: number; staleTime?: number }`
- Usa internamente `checkPermission(code)`.
- Retorna `data` como `boolean | undefined` (mientras carga).

## Ejemplos de Uso

### Listar permisos

```tsx
import { usePermissions } from "@/auth-sso/permissions-control/hooks";

function PermissionList() {
  const { data, isLoading, error } = usePermissions();
  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <ul>
      {data?.map((p) => (
        <li key={p.id}>
          {p.code} – {p.description}
        </li>
      ))}
    </ul>
  );
}
```

### Verificar un permiso puntual

```tsx
import { usePermissionCheck } from "@/auth-sso/permissions-control/hooks";

function CanEditProduct({ children }: { children: React.ReactNode }) {
  const { data: canEdit, isLoading } = usePermissionCheck("PRODUCT_EDIT");
  if (isLoading) return null;
  if (!canEdit) return null;
  return <>{children}</>;
}
```

## Buenas prácticas / Notas

- No llames directamente a `fetch` desde componentes cliente; usa los hooks provistos.
- Maneja estados de carga y error para mejorar UX.
- Ajusta `staleTime` según la frecuencia con la que cambian los permisos del usuario.
- Para invalidar manualmente: `queryClient.invalidateQueries(['permissions', 'me'])` o `['permission', 'check', code]`.

## Posibles mejoras futuras

- Agregar soporte para lotes de verificación de múltiples códigos.
- Implementar un hook `useCanAny(['CODE_A','CODE_B'])` y `useCanAll([...])`.
- Cachear resultados negativos de `checkPermission` con menor TTL.

---

## 🔗 **Integración en Componentes UI**

El sistema de permisos está completamente integrado en los componentes principales de la aplicación. A continuación se detalla cómo usar los permisos en diferentes contextos:

### 📋 **DataGrid con Control de Creación**

```tsx
import { DataGrid } from '@/components/datagrid/datagrid';

// En tu componente de lista
function ProductList() {
  return (
    <DataGrid
      onCreate={handleCreateProduct}
      createPermissions={['CREATE_PRODUCTS']} // Controla visibilidad del botón
      // ... otras props
    />
  );
}
```

### 🎛️ **ActionsMenu con Control de Acciones**

```tsx
import { ActionsMenu } from '@/components/menu/actions-menu';

// En tu componente de lista o detalle
function ProductActions({ product }: { product: Product }) {
  return (
    <ActionsMenu
      onViewDetails={() => navigateToDetails(product.id)}
      onEdit={() => navigateToEdit(product.id)}
      onActive={() => toggleActive(product.id)}
      onDelete={() => deleteProduct(product.id)}
      viewPermissions={['READ_PRODUCTS']}
      editPermissions={['UPDATE_PRODUCTS']}
      activePermissions={['UPDATE_PRODUCTS']}
      deletePermissions={['DELETE_PRODUCTS']}
    />
  );
}
```

### 🧭 **Sidebar con Control de Navegación**

```tsx
// En /layouts/sidebar/sidebar-config.tsx
export const sidebarConfig = [
  {
    id: "products",
    label: "Productos",
    path: paths.dashboard.products.list,
    permissions: ['READ_PRODUCTS'] // Se oculta si no tiene permiso
  },
  {
    id: "users", 
    label: "Usuarios",
    path: paths.dashboard.users.list,
    permissions: ['READ_USERS']
  },
  // ... más items
];
```

### 🔍 **Verificación Directa en Componentes**

```tsx
import { usePermissionCheck } from '@/auth-sso/permissions-control/hooks';

function AdminPanel() {
  const { data: canManageUsers, isLoading } = usePermissionCheck('MANAGE_USERS');
  
  if (isLoading) return <LoadingSpinner />;
  if (!canManageUsers) return <AccessDenied />;
  
  return <UserManagementInterface />;
}
```

### 📊 **Verificación Múltiple con usePermissions**

```tsx
import { usePermissions } from '@/auth-sso/permissions-control/hooks';

function Dashboard() {
  const { data: permissions, isLoading } = usePermissions();
  
  if (isLoading) return <LoadingSpinner />;
  
  const canReadProducts = permissions?.some(p => p.code === 'READ_PRODUCTS');
  const canCreateUsers = permissions?.some(p => p.code === 'CREATE_USERS');
  
  return (
    <div>
      {canReadProducts && <ProductsSection />}
      {canCreateUsers && <UserCreationForm />}
    </div>
  );
}
```
