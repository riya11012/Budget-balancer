"use server";

import { auth } from "../auth";
import { revalidatePath } from "next/cache";
import { deleteNotification } from "../repositories/notification.repository";

export async function removeNotification(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await deleteNotification(id, session.user.id);

  revalidatePath("/dashboard");
}