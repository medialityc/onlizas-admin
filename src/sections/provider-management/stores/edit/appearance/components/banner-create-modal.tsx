"use client";

import React from "react";
import SimpleModal from "@/components/modal/modal";
import { FormProvider as RHFFormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFInputWithLabel, RHFSelectWithLabel, RHFFileUpload } from "@/components/react-hook-form";
import RHFDatePicker from "@/components/react-hook-form/rhf-date-picker";
import LoaderButton from "@/components/loaders/loader-button";
import { BannerSchema, type BannerForm } from "./banner-schema";

type Props = {
	open: boolean;
	onClose: () => void;
	onCreate: (banner: BannerForm) => void;
};

export default function BannerCreateModal({ open, onClose, onCreate }: Props) {
	const methods = useForm<BannerForm>({
		resolver: zodResolver(BannerSchema) as any,
		defaultValues: {
			title: "",
			urlDestinity: "",
			position: 1,
			initDate: undefined,
			endDate: undefined,
			image: null,
			isActive: true,
		},
		mode: "onBlur",
	});

	const submitOnly = (data: BannerForm) => {
		onCreate(data);
		onClose();
	};

	// Log de errores de validación si el submit es inválido (además de los mensajes bajo los inputs)
	const handleCreate = methods.handleSubmit(
		(data: BannerForm) => submitOnly(data),
		(errors) => {
			// Visible en consola para depurar rápidamente
			try { console.warn("Errores Banner:", JSON.stringify(errors, null, 2)); } catch { }
		}
	);

	return (
		<SimpleModal open={open} onClose={onClose} title="Crear Nuevo Banner">
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
							{ label: "Slideshow", value: "3" },
						]}
					/>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<RHFDatePicker name="initDate" label="Fecha de Inicio" />
						<RHFDatePicker name="endDate" label="Fecha de Fin" />
					</div>
					<RHFFileUpload name="image" label="Imagen del Banner" />
				</div>
				<div className="mt-6 flex justify-end gap-3">
					<button type="button" className="btn btn-outline" onClick={onClose}>
						Cancelar
					</button>
					<LoaderButton type="button" className="btn btn-dark" onClick={handleCreate}>
						Crear
					</LoaderButton>

				</div>
			</RHFFormProvider>
		</SimpleModal>
	);
}
