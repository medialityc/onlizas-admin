# Manejo de permisos en auth-sso

## 1. Generación de la cookie de permisos

- Al iniciar sesión, el auth recorre todos los roles del usuario y extrae los códigos de permisos únicos.
- Estos permisos se guardan en una cookie ligera (`prm`) como un string separado por puntos: `perm1.perm2.perm3`.
- La cookie es accesible desde el cliente (no httpOnly) y se actualiza/cancela al cerrar sesión.

## 2. Lectura de permisos en el cliente

- Usa el hook `usePermissions` para obtener los permisos actuales desde la cookie.
- El hook expone:
  - `list`: array de permisos
  - `set`: Set para acceso rápido
  - `has`, `hasEvery`, `hasSome`: helpers para validación
  - `isLoaded`: booleano para saber si ya se parseó
  - `refresh`: función para forzar relectura

## 3. Configuración de rutas protegidas

- En `config/route-permissions.client.ts` define las rutas y los permisos requeridos:
  ```ts
  export const CLIENT_ROUTE_PERMISSIONS = [
    { pattern: "/dashboard/users", perms: ["users:view"] },
    { pattern: "/dashboard/users/create", perms: ["users:create"] },
    // ...
  ];
  export const ACTIVE_PERMISSIONS = true;
  ```
- Usa la función `resolveRoutePermissions(pathname)` para obtener los permisos requeridos de una ruta.

## 4. Protección de rutas en el cliente

- En el provider `AuthGuard`:
  - Obtén la ruta actual con `usePathname()`.
  - Obtén los permisos del usuario con `usePermissions()`.
  - Si `ACTIVE_PERMISSIONS` es true y la ruta requiere permisos, verifica que el usuario los tenga.
  - Si no los tiene, invoca `forbidden()` o `notFound()` de Next.js para bloquear el acceso.

## 5. Debug y actualización

- Puedes inspeccionar la cookie `prm` en el navegador para ver los permisos actuales.
- El hook refresca automáticamente al cambiar de pestaña o al recibir eventos de storage.
- Para debuggear, puedes agregar logs en el hook, en el guard o en el backend al emitir la cookie.

---

**Resumen:**

- La cookie de permisos es ligera y segura para el frontend.
- El control de acceso es reactivo y eficiente, sin roundtrips innecesarios.
- La configuración es centralizada y fácil de mantener.
