"use client";
import React from "react";
import { EditNameDialog } from "./edit-name-dialog";
import { DeleteUserDialog } from "./delete-account-dialog";
import { Button } from "@/components/ui/button";
import type { User } from "@prisma/client";

type Props = {
  user: User;
};

const UserActions = ({ user }: Props) => {
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
          Edit Profile
        </Button>
        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
          Delete Account
        </Button>
      </div>
      <EditNameDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={user}
        // onSuccess={handleUpdateSuccess}
      />
      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        userId={user.id}
        // onSuccess={handleDeleteSuccess}
      />
    </>
  );
};

export default UserActions;
