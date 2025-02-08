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
import { parseKnownError } from "@/lib/errors";

type Props = {
  post?: PostType;
  open?: boolean;
  onClose?: () => void;
  setOpen?: (open: boolean) => void;
  children?: ReactNode;
};

const EditPostDialog = ({ post, children, open, setOpen }: Props) => {
  const [isOpen, setIsOpen] = useState(open);

  const defaultValues = {
    right: post?.right || post?.content || "",
    wrong: post?.wrong || post?.content || "",
  };

  useEffect(() => {
    setIsOpen(open);
    form.reset(defaultValues);
  }, [open]);

  const onOpenChange = setOpen || setIsOpen;

  const [isPending, startTransition] = useTransition();

  const form = useForm<EditPostType>({
    resolver: zodResolver(editPostSchema),
    defaultValues: defaultValues,
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
            .catch((error) =>
              toast.error(
                parseKnownError({
                  fallbackMessage: "Ocorreu um erro ao atualizar o post",
                  error,
                })
              )
            )
            .then(onSuccess)
        : createPostAction(values)
            .catch((error) =>
              toast.error(
                parseKnownError({
                  fallbackMessage: "Ocorreu um erro ao criar o post",
                  error,
                })
              )
            )
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
        <DialogHeader className="text-left">
          <DialogTitle>{post ? "Atualizar Broa" : "Postar Broa"}</DialogTitle>
          <DialogDescription>
            {post
              ? "Atualize o seu post para partilhar com a comunidade"
              : "Escreva algo para partilhar com a comunidade"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 sm:gap-6"
          >
            <FormField
              control={control}
              name="right"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correto</FormLabel>
                  <FormControl>
                    <Textarea
                      id="right"
                      placeholder="O que está certo..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="wrong"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Broa</FormLabel>
                  <FormControl>
                    <Textarea
                      id="wrong"
                      placeholder="O que está errado..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex items-center flex-row gap-4">
              <DialogClose asChild onClick={_onClose}>
                <Button
                  type="button"
                  variant="secondary"
                  className="leading-none"
                >
                  Voltar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending}
                className="leading-none"
              >
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
