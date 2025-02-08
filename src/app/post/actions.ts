"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthUserOrThrow } from "@/app/auth/guards";
import { EditPostType } from "./schema";
// import { unstable_cacheTag as cacheTag } from "next/cache";
import { auth } from "@/auth";
import { toPostWithLikesInfo } from "./controller";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { toKnownError } from "@/lib/errors";

const rateLimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(25, "1 h"),
  prefix: "broas-rate-limit",
});

export async function createPostAction(values: EditPostType) {
  const user = await getAuthUserOrThrow();

  const { success, limit, remaining } = await rateLimit.limit(user.id);

  if (!success) {
    throw toKnownError(
      `Só pode enviar ${limit} post por hora. Restam ` + remaining
    );
  }

  await prisma.post.create({
    data: {
      right: values.right,
      wrong: values.wrong,
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
      right: values.right,
      wrong: values.wrong,
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
  limit,
  cursor,
}: {
  limit: number;
  cursor?: string;
}) => {
  return (
    await prisma.post.findMany({
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        author: true,
        likes: true,
      },
      skip: cursor ? 1 : 0,
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
