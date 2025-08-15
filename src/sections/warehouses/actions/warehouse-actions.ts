'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { updateWarehouse, createWarehouse, deleteWarehouse } from '@/services/warehouses-mock';
import { UpdateWarehouse, CreateWarehouse } from '@/types/warehouses';
import { paths } from '@/config/paths';

export async function updateWarehouseAction (
  id: number,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {    // Extraer datos del FormData
    const data: UpdateWarehouse = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as 'physical' | 'virtual',
      status: formData.get('status') as 'active' | 'inactive' | 'maintenance',
      maxCapacity: formData.get('maxCapacity') ? Number(formData.get('maxCapacity')) : undefined,
      currentCapacity: formData.get('currentCapacity') ? Number(formData.get('currentCapacity')) : undefined,
      managerName: formData.get('managerName') as string,
      managerEmail: formData.get('managerEmail') as string,
      managerPhone: formData.get('managerPhone') as string,
      locationId: formData.get('locationId') ? Number(formData.get('locationId')) : 1,
    };

    const response = await updateWarehouse(id, data); if (!response.error) {
      // Revalidar la caché de las páginas relacionadas
      revalidatePath(`/dashboard/warehouses/${id}/edit`);
      revalidatePath(`/dashboard/warehouses/${id}`);
      revalidatePath('/dashboard/warehouses');

      return { success: true };
    } else {
      return { success: false, error: response.message || 'Error al actualizar almacén' };
    }
  } catch (error) {
    console.error('Error updating warehouse:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
}

export async function createWarehouseAction (
  formData: FormData
): Promise<{ success: boolean; error?: string; warehouseId?: number }> {
  try {
    const data: CreateWarehouse = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as 'physical' | 'virtual',
      status: formData.get('status') as 'active' | 'inactive' | 'maintenance',
      maxCapacity: formData.get('maxCapacity') ? Number(formData.get('maxCapacity')) : undefined,
      currentCapacity: formData.get('currentCapacity') ? Number(formData.get('currentCapacity')) : undefined,
      managerName: formData.get('managerName') as string,
      managerEmail: formData.get('managerEmail') as string,
      managerPhone: formData.get('managerPhone') as string, locationId: formData.get('locationId') ? Number(formData.get('locationId')) : 1,
    };

    const response = await createWarehouse(data); if (!response.error && response.data) {
      // Revalidar la caché
      revalidatePath('/dashboard/warehouses');

      return { success: true, warehouseId: response.data.id };
    } else {
      return { success: false, error: response.message || 'Error al crear almacén' };
    }
  } catch (error) {
    console.error('Error creating warehouse:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
}

export async function deleteWarehouseAction (
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await deleteWarehouse(id); if (!response.error) {
      // Revalidar la caché y redirigir
      revalidatePath('/dashboard/warehouses');
      redirect(paths.dashboard.warehouses.list);
    } else {
      return { success: false, error: response.message || 'Error al eliminar almacén' };
    }
  } catch (error) {
    console.error('Error deleting warehouse:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
}

// Server Action para navegación de pestañas (opcional, si queremos trackear cambios)
export async function changeTabAction (
  warehouseId: number,
  tab: string
) {
  // Esta función podría ser útil para analytics o logging
  console.log(`User navigated to ${tab} tab for warehouse ${warehouseId}`);

  // Revalidar solo si es necesario
  revalidatePath(`/dashboard/warehouses/${warehouseId}/edit`);
}
