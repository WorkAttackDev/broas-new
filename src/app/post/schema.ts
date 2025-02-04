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
  content: z
    .string()
    .min(5, "A publicação deve ter pelo menos 5 caracteres")
    .max(300, "A publicação deve ter no máximo 300 caracteres"),
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
