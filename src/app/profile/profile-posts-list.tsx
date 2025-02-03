"use client";
import { Suspense, useState } from "react";

import PostCard from "@/app/post/post-card";
import { PostWithLikesInfoType, type PostActionType } from "@/app/post/schema";
import PostCardLikeButton, {
  LikeButtonPlaceholder,
} from "@/app/post/post-card-like-button";
import PostActions from "@/app/post/post-actions";

type Props = {
  posts: PostWithLikesInfoType[];
  userId: string | null | undefined;
};

const ProfilePostsList = ({ posts, userId }: Props) => {
  const [selectedPostAction, setSelectedPostAction] = useState<
    PostActionType | undefined
  >();

  return (
    <>
      <div className="space-y-4">
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
      </div>
      <PostActions
        selectedPostAction={selectedPostAction}
        setSelectedPostAction={setSelectedPostAction}
      />
    </>
  );
};

export default ProfilePostsList;
