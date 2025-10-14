'use client';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import BreadcrumbLinks, { BreadcrumbItem } from './breadcrumbs';

// Mapa de etiquetas legibles para segmentos de ruta.
const LABEL_MAP: Record<string, string> = {
	dashboard: 'Dashboard',
	users: 'Usuarios',
	roles: 'Roles',
	permissions: 'Permisos',
	subsystems: 'Subsistemas',
	businesses: 'Negocios',
	documents: 'Documentos',
	templates: 'Plantillas',
	edit: 'Editar',
	create: 'Crear',
	new: 'Nuevo',
};

// Detecta si un segmento es un valor dinámico (id numérico, uuid, hash largo, etc.)
function isDynamicValue(segment: string) {
	if (!segment) return false;
	if (/^\d+$/.test(segment)) return true; // solo números
	if (/^[0-9a-fA-F-]{8,}$/.test(segment) && segment.includes('-')) return true; // uuid
	if (/^[0-9a-zA-Z]{10,}$/.test(segment)) return true; // hash/alfanum largo
	return false;
}

function segmentToLabel(segment: string): string {
	if (LABEL_MAP[segment]) return LABEL_MAP[segment];
	if (isDynamicValue(segment)) return segment;
	return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
}

interface AutoBreadcrumbsProps {
	finalLabelOverride?: string; // Permite sobreescribir el último label
	showOnRoot?: boolean; // Mostrar en /dashboard (por defecto false)
	/**
	 * Permite sobreescribir el label de UN segmento específico por su valor literal.
	 * Ej: segmentOverrides={{ [userId]: userName }} reemplaza el id por el nombre.
	 */
	segmentOverrides?: Record<string, string>;
	/**
	 * Callback avanzada para resolver el label de cualquier segmento.
	 * Si retorna undefined/null se usa la lógica normal.
	 */
	segmentLabelResolver?: (args: {
		segment: string;
		index: number;
		segments: string[];
	}) => string | undefined | null;
}

const AutoBreadcrumbs: React.FC<AutoBreadcrumbsProps> = ({
	finalLabelOverride,
	showOnRoot = false,
	segmentOverrides,
	segmentLabelResolver,
}) => {
	const pathname = usePathname();

	const items: BreadcrumbItem[] = useMemo(() => {
		if (!pathname) return [];
		const segments = pathname.split('/').filter(Boolean);
		const dashboardIndex = segments.indexOf('dashboard');
		if (dashboardIndex === -1) return [];

		const relevant = segments.slice(dashboardIndex);
		if (relevant.length === 1 && !showOnRoot) return [];

		const acc: BreadcrumbItem[] = [];
		let cumulative = '';

		relevant.forEach((seg, idx) => {
			cumulative += `/${seg}`;
			const isLast = idx === relevant.length - 1;
			// 1) Override literal por diccionario
			let label: string | undefined | null = segmentOverrides?.[seg];
			// 2) Resolver dinámico vía callback si no lo resolvió el diccionario
			if (label == null && segmentLabelResolver) {
				label = segmentLabelResolver({
					segment: seg,
					index: idx,
					segments: relevant,
				});
			}
			// 3) Fallback a label normal
			if (label == null) {
				label = segmentToLabel(seg);
			}
			if (isLast && finalLabelOverride) label = finalLabelOverride;
			const dynamic = isDynamicValue(seg);
			const href = !isLast && !dynamic ? cumulative : undefined;
			acc.push({ label: String(label), href });
		});
		return acc;
	}, [
		pathname,
		finalLabelOverride,
		showOnRoot,
		segmentOverrides,
		segmentLabelResolver,
	]);

	if (!items.length) return null;
	return <BreadcrumbLinks items={items} />;
};

export default AutoBreadcrumbs;
