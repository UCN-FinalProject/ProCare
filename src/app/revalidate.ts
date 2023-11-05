"use server";

import { revalidatePath } from "next/cache";

// eslint-disable-next-line
export async function revalidatePathClient() {
  revalidatePath("/", "layout");
}
