import { auth } from "@/auth";
import ProtectedRoute from "@/components/protected-route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { toPostWithLikesInfo } from "../post/controller";
import ProfilePostsList from "./profile-posts-list";
import UserActions from "./user-actions";

const ProfilePage = async () => {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      posts: {
        include: {
          author: true,
        },
        take: 50,
      },
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const posts = user.posts.map(toPostWithLikesInfo);

  return (
    <ProtectedRoute>
      <main className="grid h-[70vh] place-items-center">
        <div className="max-w-4xl py-10">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-8 items-center justify-between">
                <div>
                  <CardTitle className="text-xl sm:text-2xl">
                    {user.name}
                  </CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
                <UserActions user={user} />
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4">
                Seus posts
              </h3>
              <ProfilePostsList posts={posts} userId={user.id} />
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedRoute>
  );
};

export default ProfilePage;
