import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PostActionType, PostType } from "@/app/post/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { EllipsisVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const PostCardSkeleton = () => {
  return (
    <Card className="min-w-[50vw]">
      <CardContent className="pt-4 sm:pt-6 pb-3 sm:pb-4 flex flex-col gap-2">
        <div className="h-3 sm:h-4 w-20 sm:w-24 bg-muted-foreground/15 rounded animate-pulse" />
        <div className="h-3 sm:h-4 w-full bg-muted-foreground/15 rounded animate-pulse" />
      </CardContent>
      <CardFooter className="py-2 sm:py-3 flex justify-between items-center">
        <div className="h-6 sm:h-8 w-12 sm:w-16 bg-muted-foreground/15 rounded animate-pulse" />
        <div className="h-3 sm:h-4 w-24 sm:w-32 bg-muted-foreground/15 rounded animate-pulse" />
      </CardFooter>
    </Card>
  );
};

type Props = {
  post: PostType;
  children?: React.ReactNode;
  onAction: (action: PostActionType) => void;

  userId: string | null | undefined;
};

const PostCard = ({ post, children, userId, onAction }: Props) => {
  return (
    <Card key={post.id} className="w-full">
      <CardContent className="py-4 sm:py-6 flex justify-between gap-2">
        <span className="flex flex-col gap-1.5 sm:gap-2">
          <h2 className="font-bold text-sm sm:text-base text-secondary-foreground">
            {post.author?.name || "Desconhecido"}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {post.content}
          </p>
        </span>
        {post.author?.id === userId && (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-fit p-1.5 sm:p-2 hover:bg-muted rounded-full outline-muted -mr-2">
              <EllipsisVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onAction({ post, action: "edit" })}
              >
                Atualizar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onAction({ post, action: "delete" })}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="py-3 sm:py-4 flex justify-between items-center">
        {children}
        <div className="text-xs sm:text-sm text-muted-foreground">
          {new Date(post.createdAt).toLocaleDateString("pt-AO")} as{" "}
          {new Date(post.createdAt).toLocaleTimeString("pt-AO", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
