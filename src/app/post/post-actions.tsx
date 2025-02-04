import React, { JSX } from "react";
import { DeletePostAlert } from "./delete-post-alert";
import { PostActionComponentProps, PostActionType } from "./schema";
import EditPostDialog from "./edit-post-dialog";

type Props = {
  selectedPostAction: PostActionType | undefined;
  setSelectedPostAction: (
    selectedPostAction: PostActionType | undefined
  ) => void;
};

const PostActions = ({ selectedPostAction, setSelectedPostAction }: Props) => {
  const actionComponent = {
    edit: EditPostDialog,
    delete: DeletePostAlert,
  } satisfies Record<
    PostActionType["action"],
    (props: PostActionComponentProps) => JSX.Element
  >;

  return Object.entries(actionComponent).map(([key, Component]) => (
    <Component
      key={key}
      onClose={() => setSelectedPostAction(undefined)}
      setOpen={(open) => {
        if (open && selectedPostAction) {
          setSelectedPostAction({
            action: key as PostActionType["action"],
            post: selectedPostAction?.post,
          });
          return true;
        } else {
          setSelectedPostAction(undefined);
          return false;
        }
      }}
      open={selectedPostAction && selectedPostAction.action === key}
      post={selectedPostAction?.post}
    />
  ));
};

export default PostActions;
