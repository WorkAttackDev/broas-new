"use client";

import { ReactNode, useState, useTransition, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Textarea } from "../../components/ui/textarea";
import { createPostAction, updatePostAction } from "@/app/post/actions";
import { editPostSchema, EditPostType, PostType } from "@/app/post/schema";
import { queryClient } from "@/app/query-provider";
import { toast } from "sonner";
import { POSTS_CACHE_TAG } from "./constants";

type Props = {
  post?: PostType;
  open?: boolean;
  onClose?: () => void;
  setOpen?: (open: boolean) => void;
  children?: ReactNode;
};

const EditPostDialog = ({ post, children, open, setOpen }: Props) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
    form.reset({
      content: post?.content || "",
    });
  }, [open]);

  const onOpenChange = setOpen || setIsOpen;

  const [isPending, startTransition] = useTransition();

  const form = useForm<EditPostType>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      content: post?.content || "",
    },
  });

  const { handleSubmit, control } = form;

  const _onClose = () => {
    onOpenChange(false);
  };

  const onSubmit = async (values: EditPostType) => {
    const onSuccess = () => {
      form.reset({});
      queryClient.invalidateQueries({ queryKey: [POSTS_CACHE_TAG] });
      _onClose();
    };

    startTransition(async () =>
      post?.id
        ? updatePostAction(post.id, values)
            .catch(() => toast.error("Ocorreu um erro ao atualizar o post"))
            .then(onSuccess)
        : createPostAction(values)
            .catch(() => toast.error("Ocorreu um erro ao criar o post"))
            .then(onSuccess)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{post ? "Atualizar Broa" : "Postar Broa"}</DialogTitle>
          <DialogDescription>
            {post
              ? "Atualize o seu post para partilhar com a comunidade"
              : "Escreva algo para partilhar com a comunidade"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="content">Conteúdo</FormLabel>
                  <FormControl>
                    <Textarea
                      id="content"
                      placeholder="Escreva algo..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild onClick={_onClose}>
                <Button type="button" variant="secondary">
                  Voltar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {post ? "Editar" : "Postar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostDialog;
