import { getPostsAction } from "@/app/post/actions";
import { auth } from "@/auth";
import PostList from "@/app/post/post-list";

const INITIAL_POSTS = 20;

const HomePage = async () => {
  const session = await auth();
  const initialPosts = await getPostsAction({
    limit: INITIAL_POSTS,
  });

  return <PostList initialPosts={initialPosts} userId={session?.user?.id} />;
};

export default HomePage;
