import { auth } from "@/auth";

export const isCurrentUser = async (id: string) => {
  const session = await auth();
  return session?.user?.id === id;
};

export const getAuthUserOrThrow = async () => {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");
  return session.user;
};
