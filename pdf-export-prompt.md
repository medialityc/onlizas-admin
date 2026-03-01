# Prompt para implementar generación de PDFs y Excel en otro proyecto

Este documento describe el patrón usado en este proyecto para generar PDFs/Excel (pallets, despachos, recepciones) y proporciona un **prompt listo para copiar/pegar** en otro proyecto.

---

## Resumen del patrón actual

- **PDFs en frontend**: se usan `jspdf` + `jspdf-autotable` con un helper genérico `exportPDF` que recibe `data[]` + una `config` con `title()`, `columns[]`, `getRows()`, `checkMissing()` y `missingColor` para resaltar filas.
- **PDFs de pallets/despachos**: combinan el helper genérico con funciones específicas como `exportPalletPdf` que arman varias secciones (resumen, órdenes, bultos, faltantes) y tablas con `autoTable`.
- **Módulos de cierre/reporte** (recepciones, facturas) pueden delegar al backend: servicios que llaman endpoints tipo `/invoice` o `/invoicePDF` y reciben una URL de PDF para abrir con `window.open(url, '_blank')`.
- **Excel**: se usa `xlsx` con la misma estructura de datos que el PDF para exportar varias hojas (Resumen, Órdenes, Bultos, Faltantes).

---

## Prompt para reutilizar en otro proyecto

Copia y ajusta este prompt en el otro proyecto (cambia nombres, rutas, etc.):

---

Quiero implementar en este proyecto una solución de generación de reportes PDF y Excel similar a la que tengo en otro proyecto de logística (pallets, despachos, recepciones). Estamos usando React + TypeScript (idealmente Next.js, pero adáptalo si no).

### Objetivo general

- Tener una forma **genérica** de generar PDFs tabulares (listas, reportes por órdenes, etc.) en el frontend.
- Tener funciones **especializadas** para reportes de pallets/despachos con:
  - Sección de resumen (datos del pallet/despacho).
  - Tabla de órdenes.
  - Tabla de bultos.
  - Tabla de bultos faltantes (si aplica).
- Poder **marcar filas “problemáticas”** (por ejemplo, peso 0) con un color de fondo.
- Opcional: exportar la misma información a Excel.

### Tecnologías a usar

- `jspdf` (o `jsPDF` según import).
- `jspdf-autotable` para generar tablas en el PDF.
- `xlsx` para Excel (opcional pero recomendable).
- TypeScript con tipos genéricos donde tenga sentido.

Instala las dependencias necesarias (ajusta al gestor de paquetes):

```bash
npm install jspdf jspdf-autotable xlsx
# o
yarn add jspdf jspdf-autotable xlsx
```

### 1. Helper genérico `exportPDF`

Implementa un helper reutilizable, por ejemplo en `src/lib/exportPDF.ts`, con estas características:

```ts
export interface PDFColumn<T = any> {
	header: string; // texto del encabezado
	field: keyof T | string; // clave del dato en la fila
	format?: (value: any, row: T) => string; // formateador opcional
}

export interface PDFConfig<T = any> {
	title: (item: T, index: number) => string; // título/encabezado por sección
	columns: PDFColumn<any>[];
	fileName: string; // nombre del archivo .pdf
	getRows?: (item: T) => any[]; // cómo obtener las filas de cada item
	checkMissing?: (row: any) => boolean; // si true, colorear la fila
	missingColor?: [number, number, number]; // color RGB para “faltantes”
}

export function exportPDF<T extends Record<string, any>>(
	data: T[],
	config: PDFConfig<T>,
): void {
	// Implementar usando:
	// - const doc = new jsPDF();
	// - fecha/hora en la esquina superior (doc.text en la parte superior derecha)
	// - bucle por cada item de data:
	//   - calcular title con config.title(item, index)
	//   - gestionar salto de página si no hay espacio suficiente
	//   - construir las filas:
	//       const rows = config.getRows ? config.getRows(item) : [item];
	//       const body = rows.map(row =>
	//         config.columns.map(col => col.format ? col.format(row[col.field], row) : (row[col.field] ?? ''))
	//       );
	//   - llamar a autoTable(doc, { head, body, ... });
	//     · head: array con los headers
	//     · styles y headStyles con alineación centrada y fuente pequeña
	//     · didParseCell: si config.checkMissing(row) es true, usar missingColor o un gris claro
	//     · didDrawPage: actualizar coordenadas y volver a pintar fecha en nuevas páginas
	// - al final, doc.save(config.fileName).
}
```

Requisitos del helper:

- Incluir fecha/hora en la parte superior de cada página.
- Manejar salto de página automáticamente con `autoTable`.
- Permitir colorear filas que cumplan `checkMissing(row)` con `missingColor`.

### 2. Helper para exportar órdenes agrupadas

Crea una función que reciba:

- El código seleccionado de orden (o `"all"`).
- Un objeto con los datos que contenga un array de bultos con campos como `orderCode`, `internalCode`, `description`, `districtName`, `weight`, etc.

Pasos:

1. Agrupa los bultos por `orderCode`.
2. Usa el helper genérico `exportPDF` sobre esa agrupación:
   - `title(order)` → `Orden: ${order.orderCode}`.
   - `getRows(order)` → `order.parcels` (o la propiedad equivalente).
   - `columns` con al menos:
     - `"Código Interno"` → `internalCode`
     - `"Descripción"` → `description`
     - `"Distrito"` → `districtName`
     - `"Peso (kg)"` (o lb) → `weight` con `format` que haga `toFixed(2)` si aplica.
   - `fileName` algo como: `pallets_${selectedOrder === 'all' ? 'todas' : selectedOrder}.pdf`.
   - `checkMissing(parcel)` que devuelva `true` si el peso es 0 o nulo, para resaltar esa fila (ej. `(parcel.weight ?? 0) <= 0`).
   - `missingColor` un tono rojo suave `[230, 200, 200]`.

Expón esta función como un callback que se pueda usar en botones de UI (ej. tabla de pallets, botón “Exportar órdenes a PDF”).

### 3. Helper de reporte detallado de pallet/despacho

Implementa una función tipo `exportPalletPdf` que reciba:

- El objeto principal (`pallet` o `despacho`) con propiedades como:
  - `palletCode` o `dispatchCode`.
  - `subscriptionCode`.
  - `status` / `statusName`.
  - `strategyName`.
  - `locationName`.
  - `createdDatetime`.
  - Contadores: `orderCount`, `packageCount`, `parcelsCount`, `subPalletsCount`, etc.
- Opcionalmente:
  - Lista de bultos (parcels) mapeada a un tipo sencillo (`orderCode`, `internalCode`, `weight`, `description`, `districtName`).
  - Estructura de “faltantes” agrupados por orden.

La función debe:

1. Crear un `jsPDF`.
2. Pintar un título grande: `Pallet ${pallet.palletCode}` o `Despacho ${dispatchCode}`.
3. Pintar un bloque resumen como tabla de 2 columnas (`Campo`, `Valor`) usando `autoTable`.
4. Calcular un resumen por orden:
   - Agrupar bultos por `orderCode`.
   - Contar cuántos bultos tiene cada orden y el peso total por orden.
   - Renderizar otra tabla de órdenes (`Código`, `Bultos`, `Peso Total`).
5. Renderizar una tabla de bultos:
   - Columnas sugeridas: `Orden`, `Código Interno`, `Peso`, `Descripción`, `Distrito`.
6. Si hay “faltantes”:
   - Sección con título “Bultos Faltantes”.
   - Tabla con columnas como `Orden`, `HBL` o `N° Bulto`, `Peso`, `Descripción`.
7. Gestionar correctamente la posición vertical entre tablas utilizando `lastAutoTable.finalY` (o equivalente) y añadiendo márgenes razonables.
8. Guardar el archivo con `doc.save(`${palletCode}.pdf`)` o nombre equivalente.

### 4. Exportación a Excel

Usa `xlsx` para generar un `.xlsx` con:

- Hoja **Resumen** con los datos del resumen del pallet/despacho.
- Hoja **Órdenes** con filas agrupadas por orden (código, número de bultos, peso total).
- Hoja **Bultos** con las mismas columnas que la tabla de bultos del PDF.
- Hoja **Bultos Faltantes** si existen, con la misma info que el bloque de faltantes del PDF.

Estructura base:

```ts
const wb = XLSX.utils.book_new();
// Crear hojas con XLSX.utils.json_to_sheet(...)
// Añadirlas con XLSX.utils.book_append_sheet(wb, ws, 'NombreHoja');
XLSX.writeFile(wb, nombreArchivo);
```

### 5. Integración con la UI

En las pantallas donde se listan pallets/despachos o recepciones, añade botones:

- “Exportar a PDF (detalle pallet/despacho)” → llama a `exportPalletPdf(...)`.
- “Exportar órdenes a PDF” → llama al helper de órdenes agrupadas.
- “Exportar a Excel” → llama al helper basado en `xlsx`.

Ten en cuenta:

- Estados de carga (`loading`/`disabled`).
- Manejo de errores con toasts o componentes de error.

### 6. PDFs generados desde el backend (módulos de cierre)

Además de la generación en frontend, implementa un patrón para PDFs generados por el backend:

- Crea servicios que llamen endpoints tipo:
  - `GET /receptions/{id}/invoice` → devuelve una `string` con la URL del PDF.
  - `POST /orders/{id}/invoice-pdf` → devuelve `{ pdfUrl: string }`.
- Los servicios deben:
  - Usar el cliente HTTP del proyecto (auth, manejo de errores, etc.).
  - Retornar un objeto de alto nivel (ej. `{ error, data, message }`).
- En el frontend:
  - Al pulsar el botón de “Reporte” o “Cerrar”, llamar al servicio.
  - Si se recibe una URL válida, abrirla con `window.open(url, '_blank')`.
  - Gestionar estados de `downloadingReport` y errores.

### 7. Estilo y calidad

- Todo en TypeScript, con tipos explícitos para las estructuras de datos (pallet, despacho, bulto, faltante, etc.).
- Reutilizar helpers genéricos tanto como sea posible.
- Mantener el código modular: un archivo para `exportPDF` genérico, otros para exportadores específicos y otro para Excel.
- Si hay dudas de formato (unidades de peso, nombres de campos, branding del PDF), se debe preguntar antes de asumir.

---

Con este prompt puedes pedir a otro asistente o a ti mismo que diseñe e implemente toda la infraestructura de exportación a PDF/Excel descrita aquí, integrada con la UI del proyecto y siguiendo buenas prácticas de React + TypeScript.
