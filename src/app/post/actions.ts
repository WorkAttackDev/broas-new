"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthUserOrThrow } from "@/app/auth/guards";
import { EditPostType } from "./schema";
// import { unstable_cacheTag as cacheTag } from "next/cache";
import { auth } from "@/auth";
import { toPostWithLikesInfo } from "./controller";

export async function createPostAction(values: EditPostType) {
  const user = await getAuthUserOrThrow();

  await prisma.post.create({
    data: {
      content: values.content,
      authorId: user.id,
    },
  });

  revalidatePath("/");
}

export async function updatePostAction(postId: string, values: EditPostType) {
  const user = await getAuthUserOrThrow();

  await prisma.post.update({
    where: {
      id: postId,
      authorId: user.id,
    },
    data: {
      content: values.content,
    },
  });

  revalidatePath("/");
}

export async function deletePostAction(postId: string) {
  const user = await getAuthUserOrThrow();

  await prisma.post.delete({
    where: {
      id: postId,
      authorId: user.id,
    },
  });

  revalidatePath("/");
}

export const togglePostLikeAction = async ({ postId }: { postId: string }) => {
  const user = await getAuthUserOrThrow();

  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: user.id,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        postId_userId: {
          postId,
          userId: user.id,
        },
      },
    });
  } else {
    await prisma.like.create({
      data: {
        postId,
        userId: user.id,
      },
    });
  }

  revalidatePath("/");
};

export const getPostsAction = async ({
  offset = 0,
  limit,
}: {
  offset?: number;
  limit: number;
}) => {
  return (
    await prisma.post.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        likes: true,
      },
    })
  ).map(toPostWithLikesInfo);
};

export const getPostLikesInfoAction = async ({
  postId,
}: {
  postId: string;
}) => {
  const session = await auth();
  const userId = session?.user?.id;

  const [likes, liked] = await Promise.allSettled([
    prisma.like.count({
      where: {
        postId,
      },
    }),
    !userId
      ? null
      : prisma.like.findUnique({
          where: {
            postId_userId: {
              postId,
              userId: userId,
            },
          },
        }),
  ]);

  return {
    likes: likes.status === "fulfilled" ? likes.value : 0,
    liked: liked.status === "fulfilled" ? !!liked.value : false,
  };
};
