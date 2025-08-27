"use client";

import React, { useEffect } from "react";
import SimpleModal from "@/components/modal/modal";
import { FormProvider as RHFFormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFInputWithLabel, RHFSelectWithLabel, RHFFileUpload } from "@/components/react-hook-form";
import RHFDatePickerBanner from "@/components/react-hook-form/rhf-date-picker-banner";
import LoaderButton from "@/components/loaders/loader-button";
import { BannerSchema, type BannerForm } from "./banner-schema";
import { BannerItem } from "@/types/stores";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";


type Props = {
	open: boolean;
	onClose: () => void;
	onCreate: (banner: BannerForm) => void;
	onUpdate?: (id: number, banner: BannerForm) => void;
	editingBanner?: BannerItem | null; // Banner que se está editando
};

export default function BannerCreateModal({ open, onClose, onCreate, onUpdate, editingBanner }: Props) {
	const isEditing = !!editingBanner;

	const methods = useForm<BannerForm>({
		resolver: zodResolver(BannerSchema),
		defaultValues: {
			title: "",
			urlDestinity: "",
			position: 1,
			initDate: new Date(), // Fecha de hoy por defecto
			endDate: new Date(), // Fecha de hoy por defecto
			image: "",
			isActive: true,
		},
		mode: "onBlur",
	});

	// Resetear el formulario cuando se abre el modal
	useEffect(() => {
		
		if (open) {
			if (isEditing && editingBanner) {				
				const initDate = editingBanner.initDate ? new Date(editingBanner.initDate) : new Date();
				const endDate = editingBanner.endDate ? new Date(editingBanner.endDate) : new Date()

				// parsear posición de forma segura
				const parsedPos = Number(editingBanner.position ?? 1);
				const position = Number.isFinite(parsedPos) ? parsedPos : 1;

				// Cargar datos del banner a editar - convertir fechas string a Date correctamente
				methods.reset({
					title: editingBanner.title || "",
					urlDestinity: editingBanner.urlDestinity || "",
					position: position,
					initDate: initDate,
					endDate: endDate,
					image: editingBanner.image ?? "",
					isActive: editingBanner.isActive ?? true,
				});
				
			} else {				
				methods.reset({
					title: "",
					urlDestinity: "",
					position: 1,
					initDate: new Date(),
					endDate: new Date(),
					image: "",
					isActive: true,
				});
			}
		}
	}, [open, isEditing, editingBanner, methods]);

	const submitOnly = (data: BannerForm) => {		
		if (isEditing && editingBanner && onUpdate) {			
			onUpdate(editingBanner.id, data);
		} else {
			
			onCreate(data);
		}
		onClose();
	};

	// Log de errores de validación si el submit es inválido (además de los mensajes bajo los inputs)
	const handleSubmit = methods.handleSubmit(
		(data: BannerForm) => submitOnly(data),
		(errors) => {
			// Visible en consola para depurar rápidamente
			try { console.warn("Errores Banner:", JSON.stringify(errors)); } catch { }
		}
	);

	const modalTitle = isEditing ? "Editar Banner" : "Crear Nuevo Banner";
	const submitButtonText = isEditing ? "Actualizar" : "Crear";

	return (
		<SimpleModal open={open} onClose={onClose} title={modalTitle}>
			<RHFFormProvider {...methods}>
				<div className="grid grid-cols-1 gap-4">
					<RHFInputWithLabel name="title" label="Título" placeholder="Título del banner" />
					<RHFInputWithLabel name="urlDestinity" label="URL de Destino" placeholder="/productos/ofertas" />
					<RHFSelectWithLabel
						name="position"
						label="Posición"
						options={[
							{ label: "Hero (Principal)", value: "1" },
							{ label: "Sidebar", value: "2" },
							{ label: "Footer", value: "3" },
						]}
					/>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<RHFDatePickerBanner
							name="initDate"
							label="Fecha de Inicio"							
							minDate={isEditing ? undefined : new Date()}
						/>
						<RHFDatePickerBanner
							name="endDate"
							label="Fecha de Fin"
							minDate={isEditing ? undefined : new Date()}
						/>
					</div>
					<RHFImageUpload name="image" label="Imagen del Banner" variant="rounded" />
				</div>
				<div className="mt-6 flex justify-end gap-3">
					<button type="button" className="btn btn-outline" onClick={onClose}>
						Cancelar
					</button>
					<LoaderButton type="button" className="btn btn-dark" onClick={handleSubmit}>
						{submitButtonText}
					</LoaderButton>

				</div>
			</RHFFormProvider>
		</SimpleModal>
	);
}
