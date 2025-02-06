"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { isCurrentUser } from "@/app/auth/guards";

export async function updateUserAction({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  if (!(await isCurrentUser(id))) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { name },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUserAction({ id }: { id: string }) {
  if (!(await isCurrentUser(id))) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export const getUserProfileAction = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        include: {
          author: true,
        },
        take: 50,
        orderBy: { updatedAt: "desc" },
      },
    },
  });
};
