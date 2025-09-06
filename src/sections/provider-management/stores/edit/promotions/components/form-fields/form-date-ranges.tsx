import { useFormContext, useFieldArray } from "react-hook-form";
import RHFDatePickerBanner from "@/components/react-hook-form/rhf-date-picker-banner";
import { Button } from "@/components/button/button";
import { PlusIcon } from '@heroicons/react/24/solid';
import { TrashIcon } from "@heroicons/react/24/outline";

/**
 * FormDateRanges manages an array of date ranges (start/end pairs) that the user can add/remove.
 * It exposes the field `dateRanges` as an array of objects with startDate and endDate properties.
 */
export default function FormDateRanges({ name = "dateRanges" }: { name?: string }) {
	const { control } = useFormContext();
	const { fields, append, remove } = useFieldArray({ control, name });
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Normalizar a medianoche

	const addNewRange = () => {
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);
		append({
			startDate: today,
			endDate: tomorrow
		});
	};

	return (
		<div className="space-y-4">
			<div className="flex items-start justify-between gap-1">
				<label className="mb-0 text-sm font-semibold text-gray-900  dark:text-gray-100">Rangos de fechas</label>
				<Button type="button" size="sm" className="ml-2" variant="secondary" onClick={addNewRange}>
					<PlusIcon className="w-4 h-4" />
					<span className="sr-only">Agregar rango</span>
				</Button>
			</div>

			<div className="space-y-4">
				{fields.length === 0 && (
					<div className="text-sm text-gray-500">No hay rangos de fechas seleccionados</div>
				)}

				{fields.map((field, idx) => (
					<div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-sm  dark:text-gray-100 font-medium text-gray-700">Rango {idx + 1}</span>
							<Button
								type="button"
								iconOnly
								variant="secondary"
								size="sm"
								onClick={() => remove(idx)}
							>
								<TrashIcon className="w-4 h-4 text-white-600" />
							</Button>
						</div>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<RHFDatePickerBanner 
									name={`${name}.${idx}.startDate`} 
									label="Fecha de inicio"
									minDate={today} 
								/>
							</div>
							<div>
								<RHFDatePickerBanner 
									name={`${name}.${idx}.endDate`} 
									label="Fecha de fin"
									minDate={today} 
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
