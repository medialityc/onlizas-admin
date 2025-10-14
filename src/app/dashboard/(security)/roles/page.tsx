import { buildQueryParams } from '@/lib/request';
import RoleListContainer from '@/sections/roles/list/role-list-container';
import { getAllRoles } from '@/services/roles';
import { IQueryable, SearchParams } from '@/types/fetch/request';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Gestión de Roles - ZAS Admin',
	description: 'Administra los roles del sistema y sus permisos',
	icons: {
		icon: '/assets/images/NEWZAS.svg',
	},
};

interface PageProps {
	searchParams: Promise<SearchParams>;
}

async function RoleListPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const query: IQueryable = buildQueryParams(params);
	const res = await getAllRoles(query);
	if (res.error || !res.data) {
		throw new Error(res.message);
	}

	return (
		<RoleListContainer
			rolesPromise={res}
			query={params}
		/>
	);
}

export default RoleListPage;
