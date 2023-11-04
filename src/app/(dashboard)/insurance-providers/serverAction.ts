"use server";

import { revalidatePath } from "next/cache";

// eslint-disable-next-line
export async function revalidateHealthProviderPath(id: number | undefined) {
  revalidatePath("/insurance-providers", "layout");
}
