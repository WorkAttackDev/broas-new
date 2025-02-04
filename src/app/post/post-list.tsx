"use client";

import { useEffect, useRef, Suspense, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { PostActionType, PostWithLikesInfoType } from "@/app/post/schema";
import { getPostsAction } from "@/app/post/actions";
import PostCard from "@/app/post/post-card";
import PostCardLikeButton, {
  LikeButtonPlaceholder,
} from "@/app/post/post-card-like-button";
import { POSTS_CACHE_TAG } from "@/app/post/constants";
import PostActions from "./post-actions";

type Props = {
  initialPosts: PostWithLikesInfoType[];
  userId: string | null | undefined;
};

const POSTS_PER_PAGE = 20;

import { Card, CardContent } from "@/components/ui/card";

const NoPosts = () => {
  return (
    <Card className="w-[80vw] mx-auto max-w-3xl">
      <CardContent className=" flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 text-sm">
          Nenhuma publicação encontrada, você pode criar uma agora!
        </p>
      </CardContent>
    </Card>
  );
};

export default function PostList({ initialPosts, userId }: Props) {
  const listContainerRef = useRef<HTMLElement>(null);
  const { ref, inView } = useInView();

  const [selectedPostAction, setSelectedPostAction] = useState<
    PostActionType | undefined
  >();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [POSTS_CACHE_TAG],
      queryFn: ({ pageParam }) =>
        getPostsAction({
          cursor: pageParam,
          limit: POSTS_PER_PAGE,
        }),
      initialPageParam: undefined,
      getNextPageParam: (lastPage: PostWithLikesInfoType[]) => {
        return lastPage.length > 0
          ? lastPage[lastPage.length - 1].id
          : undefined;
      },
      initialData: () => ({
        pages: [initialPosts],
        pageParams: [undefined],
      }),
    });

  const posts = data?.pages.flat() || [];

  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      listContainerRef.current &&
      listContainerRef.current.clientHeight > window.innerHeight
    ) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <main className="p-4 w-full grid items-center">
      <section
        ref={listContainerRef}
        className="grid w-[80vw] gap-4 max-w-4xl mx-auto"
      >
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            userId={userId}
            onAction={setSelectedPostAction}
          >
            <Suspense fallback={<LikeButtonPlaceholder />}>
              <PostCardLikeButton post={post} userId={userId} />
            </Suspense>
          </PostCard>
        ))}
        <PostActions
          selectedPostAction={selectedPostAction}
          setSelectedPostAction={setSelectedPostAction}
        />
        {hasNextPage && (
          <div ref={ref} className="text-center text-gray-500">
            {isFetchingNextPage ? "carregando mais postagens" : ""}
          </div>
        )}
      </section>
      {posts.length === 0 && <NoPosts />}
    </main>
  );
}
