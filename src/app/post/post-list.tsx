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
          offset: pageParam,
          limit: POSTS_PER_PAGE,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage: PostWithLikesInfoType[], allPages) => {
        if (lastPage.length < POSTS_PER_PAGE) return undefined;
        return allPages.reduce((acc, page) => acc + page.length, 0);
      },
      initialData: () => ({
        pages: [initialPosts],
        pageParams: [0],
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
      <section ref={listContainerRef} className="grid gap-4 max-w-4xl mx-auto">
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
    </main>
  );
}
