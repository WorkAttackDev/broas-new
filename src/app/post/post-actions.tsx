import React, { JSX } from "react";
import EditPostDialog from "./edit-post-dialog";
import { DeletePostAlert } from "./delete-post-alert";
import { PostActionComponentProps, PostActionType } from "./schema";

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
      open={selectedPostAction && selectedPostAction.action === key}
      post={selectedPostAction?.post}
    />
  ));
};

export default PostActions;
