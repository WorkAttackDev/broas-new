import { z } from "zod";
import type { Like, Post, User } from "@prisma/client";

export type LikesInfoPromiseType = Promise<{ likes: number; liked: boolean }>;

export type PostType = Post & {
  author?: User | null;
  likes?: Like[];
};

export type PostWithLikesInfoType = PostType & {
  likesInfo: LikesInfoPromiseType;
};

export const editPostSchema = z.object({
  right: z
    .string()
    .min(5, "O campo correto deve ter pelo menos 5 caracteres")
    .max(200, "O campo correto deve ter no máximo 200 caracteres"),
  wrong: z
    .string()
    .min(5, "O campo errado deve ter pelo menos 5 caracteres")
    .max(200, "O campo errado deve ter no máximo 200 caracteres"),
});

export type EditPostType = z.infer<typeof editPostSchema>;

export type PostActionComponentProps = {
  onClose: () => void;
  open: boolean;
  post: PostWithLikesInfoType | undefined;
};

export type PostActionType = {
  post: PostType;
  action: "edit" | "delete";
};
