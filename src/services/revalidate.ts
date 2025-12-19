"use server";

import { revalidatePath, updateTag } from "next/cache";

export async function revalidateTagFn(tag: string) {
  updateTag(tag);
}

export async function revalidatePathFn(tag: string) {
  revalidatePath(tag);
}
