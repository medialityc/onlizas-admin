'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function revalidateTagFn(tag: string) {
	revalidateTag(tag);
}

export async function revalidatePathFn(tag: string) {
	revalidatePath(tag);
}
