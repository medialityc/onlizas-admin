# ZAS Admin Panel

Panel de administración para el ecosistema ZAS: gestión de usuarios, catálogo, inventarios, almacenes, permisos y procesos.

**Stack:** Next.js 15 · React 19 · TypeScript · React Query 5 · RHF · Tailwind · Mantine · Zustand · Redux Toolkit

## 🚀 Características principales

- Autenticación (SSO / NextAuth) y manejo de sesión.
- Gestión de proveedores, productos, inventarios y almacenes (físicos / virtuales).
- Soporte multi–idioma (i18n con `next-intl` / `react-i18next`).
- Formularios tipados con `react-hook-form` + `zod` + componentes reutilizables.
- Data–fetching con `@tanstack/react-query` (caché, reintentos, invalidación selectiva).
- UI híbrida: Tailwind + Mantine + Radix Primitives.
- Theming (modo oscuro / claro) y diseño responsivo.
- Gestión de estado local/zona gris con Zustand y Redux Toolkit donde aplica.
- Componentes avanzados: tablas, selects remotos con scroll infinito, editores de texto, filtros dinámicos.

## 📦 Stack técnico

| Capa                 | Librerías                                         |
| -------------------- | ------------------------------------------------- |
| Framework            | Next.js 15 (App Router)                           |
| Lenguaje             | TypeScript 5                                      |
| UI                   | TailwindCSS, Mantine, Radix UI, Heroicons, Lucide |
| Formularios          | react-hook-form, zod, custom RHF components       |
| Data Fetch           | React Query 5, fetch wrapper (`lib/request.ts`)   |
| Estado               | Zustand, Redux Toolkit (slices específicos)       |
| Internacionalización | next-intl / ni18n / react-i18next                 |
| Autenticación        | next-auth                                         |
| Otros                | date-fns, lodash, react-toastify, swiper, lottie  |

## 🗂️ Estructura relevante

```text
src/
	app/                # Rutas Next.js (App Router)
	components/         # Componentes UI y RHF reutilizables
	sections/           # Feature modules (inventario, productos, etc.)
	services/           # Llamadas a API (fetchers)
	hooks/              # Hooks compartidos (react-query, formularios, etc.)
	lib/                # Utilidades base (request, endpoints, helpers)
	layouts/            # Layouts y wrappers de página
	store/              # Zustand / Redux slices
	i18n/               # Configuración de internacionalización
	contexts/           # React Context Providers
```

## Módulo de Finanzas (Maquetación)

Se incluye una maquetación funcional del módulo de finanzas con navegación y vistas base:

- Rutas:

  - `/finance` (Resumen)
  - `/finance/closures` (Cierres: filtro por fecha, generación parcial)
  - `/finance/account-states` (Estados de cuenta: desglose Onlizas/Impuestos/Proveedores/Logística)
  - `/finance/entity-accounts` (CRUD cuentas de plataforma y proveedores)
  - `/finance/payables-receivables` (Cuentas por pagar y por cobrar, reintento de pago)

- Navegación: accesos en el sidebar dentro de "Finanzas y Pagos".

- Estado: vistas con componentes y tablas de ejemplo listas para conectar a APIs (`GET/POST`) y cron jobs. No hay integración de datos aún.

## 🛠 Requisitos previos

- Node.js 20+ (recomendado LTS)
- PNPM o Bun/NPM (el proyecto incluye `bun.lock`, pero puedes usar PNPM/NPM si ajustas)
- Variables de entorno (archivo `.env.local`)

## ⚙️ Configuración inicial

1. Clonar el repositorio:

   ```bash
   git clone <repo-url>
   cd onlizas
   ```

2. Instalar dependencias:

   ```bash
   npm install
   # o
   pnpm install
   # o
   bun install
   ```

3. Crear `.env.local` (ejemplo):

   ```bash
   NEXT_PUBLIC_API_BASE=https://api.zas.local
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=changeme
   # Otros... (tokens, endpoints, claves externas)
   ```

4. Ejecutar en desarrollo:

   ```bash
   npm run dev
   ```

5. Abrir en navegador: `http://localhost:3000`

## 📜 Scripts disponibles

| Script  | Descripción                    |
| ------- | ------------------------------ |
| `dev`   | Modo desarrollo con Turbopack  |
| `build` | Compila para producción        |
| `start` | Sirve la build compilada       |
| `lint`  | Ejecuta ESLint sobre el código |

## 🧩 Patrones y convenciones

- Servicios: una función por endpoint en `src/services/*` devolviendo promesas tipadas.
- Esquemas de validación: `zod` en `schemas/` dentro de cada sección.
- Componentes de formulario prefijados con `RHF*` para consistencia.
- Query Keys: usar prefijos claros (`products-<supplierId>`, `warehouses-physical-<id>`...).
- Estilos: Tailwind primero; Mantine para componentes complejos; Radix para accesibilidad.
- Archivos de índice: evitar re-exportar indiscriminadamente si aumenta el bundle.

## 🔄 Data Fetching & React Query

Ejemplo de uso estándar (paginación infinita + búsqueda):

```ts
useInfiniteQuery({
  queryKey: ["products", supplierId, params],
  queryFn: ({ pageParam }) => fetchProducts({ ...params, cursor: pageParam }),
});
```

Cuando un campo depende de otro (ej. `supplierId`), incluirlo en `queryKey` para invalidación natural.

## 🧪 Testing (Pendiente / sugerido)

Se recomienda integrar:

- Vitest o Jest para pruebas unitarias.
- Playwright para flujos críticos (login, creación de inventario).

## 🚢 Despliegue

Build estándar:

```bash
npm run build
npm run start
```

Con Docker (ejemplo mínimo):

```bash
docker build -t zas-admin .
docker run -p 3000:3000 --env-file .env.production zas-admin
```

## 🔐 Seguridad básica

- Nunca exponer secretos en bundle (`NEXT_PUBLIC_` solo para claves públicas).
- Usar `https` en producción.
- Revisar sanitización en entradas de usuario antes de enviar a API.

## 🤝 Contribuir

1. Crear rama feature: `feat/nombre-corto`.
2. Commits convencionales (`feat:`, `fix:`, `chore:`...).
3. Pull Request con resumen funcional y screenshots si aplica.

## 🗺 Roadmap sugerido

- [ ] Integrar tests unitarios.
- [ ] Añadir Storybook para componentes críticos.
- [ ] Modo offline / cache persistente.
- [ ] Auditoría de accesibilidad (ARIA, contraste, focus states).
- [ ] Metrización (Sentry / OpenTelemetry).

## 🧰 Troubleshooting

| Problema       | Posible causa         | Solución                               |
| -------------- | --------------------- | -------------------------------------- |
| `fetch failed` | URL API incorrecta    | Verificar `NEXT_PUBLIC_API_BASE`       |
| Sesión expira  | Token inválido        | Revisar backend / renovar credenciales |
| Estilos rotos  | Tailwind no recompila | Borrar `.next/` y reiniciar dev        |
| Datos viejos   | Query cache stale     | Cambiar queryKey / invalidar manual    |

## 📄 Licencia

Privado / Interno. No distribuir sin autorización.

---

Hecho con ❤️ por el equipo ZAS.
