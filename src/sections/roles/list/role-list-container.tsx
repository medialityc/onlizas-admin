'use client';

import useFiltersUrl from '@/hooks/use-filters-url';
import { ApiResponse } from '@/types/fetch/api';
import { SearchParams } from '@/types/fetch/request';
import { GetAllRolesResponse } from '@/types/roles';
import { RoleList } from './role-list';

interface RoleListPageProps {
	rolesPromise: ApiResponse<GetAllRolesResponse>;
	query: SearchParams;
}

export default function RoleListContainer({
	rolesPromise,
	query,
}: RoleListPageProps) {
	const { updateFiltersInUrl } = useFiltersUrl();

	const handleSearchParamsChange = (params: SearchParams) => {
		updateFiltersInUrl(params);
	};

	return (
		<div className='space-y-6'>
			<div className='panel'>
				<div className='mb-5 flex items-center justify-between'>
					<div>
						<h2 className='text-xl font-semibold text-dark dark:text-white-light'>
							Gestión de Roles
						</h2>
						<p className='text-sm text-gray-500 dark:text-gray-400'>
							Administra los roles del sistema y sus permisos asociados
						</p>
					</div>
				</div>

				<RoleList
					data={rolesPromise.data}
					searchParams={query}
					onSearchParamsChange={handleSearchParamsChange}
				/>
			</div>
		</div>
	);
}
