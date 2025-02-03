import { User, Post } from "@prisma/client";
import { z } from "zod";

export type PostWithAuthor = Post & {
  author: User;
};

export const updateUserSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
});

export type UpdateUserType = z.infer<typeof updateUserSchema>;
