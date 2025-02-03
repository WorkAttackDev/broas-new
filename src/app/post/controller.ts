import { getPostLikesInfoAction } from "./actions";
import { PostType, PostWithLikesInfoType } from "./schema";

export const toPostWithLikesInfo = (post: PostType): PostWithLikesInfoType => ({
  ...post,
  likesInfo: getPostLikesInfoAction({ postId: post.id }),
});
