

export default function PromotionTypeHeader({ title, description, icon }: { title: string; description?: string; icon?: React.ReactNode }) {
	return (
		<div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 bg-teal-100 dark:bg-teal-600/20 rounded-lg flex items-center justify-center">{icon ?? <span>🖿</span>}</div>
				<div>
					<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
					{description && <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>}
				</div>
			</div>
		</div>
	);
}
