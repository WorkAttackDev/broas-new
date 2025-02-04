"use client";

import { PostWithLikesInfoType } from "@/app/post/schema";
import { Button, buttonVariants } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { togglePostLikeAction } from "@/app/post/actions";
import { use } from "react";
import { queryClient } from "../query-provider";
import { useOptimistic } from "react";
import Link from "next/link";
import { links } from "@/utils/links";
import { toast } from "sonner";
import { POSTS_CACHE_TAG } from "./constants";

type Props = {
  post: PostWithLikesInfoType;
  userId: string | null | undefined;
};

export const LikeButtonPlaceholder = () => {
  return (
    <div className="flex text-secondary gap-2 text-sm items-center">
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="bg-muted text-secondary ease-out duration-200"
      >
        <Loader2 className="size-4 ease-out duration-200 animate-spin" />
      </Button>
    </div>
  );
};

const PostCardLikeButton = ({ post, userId }: Props) => {
  const likeInfo = (post.likesInfo && use(post.likesInfo)) || {
    likes: 0,
    liked: false,
  };

  const [{ likes, liked }, addOptimistic] = useOptimistic(
    likeInfo,
    (currState, optimisticValue: typeof likeInfo) => {
      return {
        ...currState,
        likes: optimisticValue.likes,
        liked: optimisticValue.liked,
      };
    }
  );

  const toggleLike = async () => {
    const optimisticValue = {
      likes: liked ? likes - 1 : likes + 1,
      liked: !liked,
    };
    addOptimistic(optimisticValue);
    togglePostLikeAction({ postId: post.id })
      .catch(() => {
        addOptimistic(likeInfo);
        toast.error("Ocorreu um erro ao curtir o post");
      })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: [POSTS_CACHE_TAG] });
      });
  };
  if (!userId) {
    return (
      <div className="flex text-secondary gap-2 text-sm items-center">
        <Link
          href={links.signin.href}
          className={cn(
            buttonVariants({
              variant: "ghost",
              size: "icon",
            }),
            "bg-muted text-secondary ease-out duration-200"
          )}
        >
          <Heart className="h-4 w-4 ease-out duration-200" />
        </Link>
        {likes}
      </div>
    );
  }
  return (
    <form
      action={toggleLike}
      className="flex text-secondary gap-2 text-sm items-center"
    >
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="bg-muted text-secondary ease-out duration-200"
      >
        <Heart
          className={cn(
            "h-4 w-4 ease-out duration-200",
            liked && "fill-red-500 text-red-500"
          )}
        />
      </Button>
      {likes}
    </form>
  );
};

export default PostCardLikeButton;
