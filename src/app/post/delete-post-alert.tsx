"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deletePostAction } from "@/app/post/actions";
import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { queryClient } from "../query-provider";
import { POSTS_CACHE_TAG } from "./constants";
import { PostType } from "./schema";

type Props = {
  post?: PostType;
  open?: boolean;
  onClose?: () => void;
};

export const DeletePostAlert = ({ post, open, onClose }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () =>
    startTransition(() => {
      if (!post) return;
      deletePostAction(post.id)
        .catch(() => toast.error("Ocorreu um erro ao excluir o post"))
        .then(() => {
          queryClient.invalidateQueries({ queryKey: [POSTS_CACHE_TAG] });
          toast.success("Post excluído com sucesso");
          onClose?.();
        });
    });

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Post</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este post?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <form action={handleDelete}>
            <AlertDialogAction disabled={isPending} type="submit">
              Excluir
              {isPending && <Loader2 className="ml-2 animate-spin size-4" />}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
