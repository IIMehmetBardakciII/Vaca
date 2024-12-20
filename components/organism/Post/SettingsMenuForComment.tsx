"use client";

import { Button } from "@/components/ui/button";
import { actionThePost } from "@/lib/actions/actionThePost";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type SettingsMenuForCommentType = {
  onClickForEdit: () => void;
  onClickForDelete: () => void;
  postId: number;
  virtualAcademyId: string;
  commentId: string;
  collectionName: "Posts" | "ForumPosts";
};
const SettingsMenuForComment = ({
  onClickForEdit,
  onClickForDelete,
  postId,
  commentId,
  virtualAcademyId,
  collectionName,
}: SettingsMenuForCommentType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openDialogForDelete, setOpenDialogForDelete] =
    useState<boolean>(false);

  return (
    <div className="relative ">
      <ChevronDown
        onClick={() => setIsOpen((currentState) => !currentState)}
        className="cursor-pointer hover:bg-gray-200 rounded-md"
      />
      {isOpen && (
        <div className="absolute top-6 right-0 flex gap-2 z-[50] rounded-md">
          <Button
            onClick={onClickForEdit}
            variant={"default"}
            className="bg-blue-500 text-white"
          >
            Düzenle
          </Button>
          <Button
            onClick={() => setOpenDialogForDelete(true)}
            variant={"default"}
            className="bg-red-500 text-white"
          >
            Sil
          </Button>
        </div>
      )}

      {openDialogForDelete && (
        <Dialog
          open={openDialogForDelete}
          onOpenChange={() => setOpenDialogForDelete(false)}
        >
          <DialogContent className="fixed inset-0 bg-black/25 z-50  flex flex-col items-center justify-center">
            <div className="bg-secondary p-4 flex items-center flex-col justify-center gap-2 rounded-md">
              <DialogTitle>Yorumu silmek istediğine emin misin?</DialogTitle>
              <div>
                <Button
                  onClick={async () => {
                    await actionThePost({
                      postId: String(postId),
                      type: "DeleteComment",
                      virtualAcademyId,
                      collectionName,
                      commentId,
                    });

                    onClickForDelete();
                  }}
                  className="bg-red-500 relative mr-2"
                >
                  Evet
                </Button>
                <Button onClick={() => setOpenDialogForDelete(false)}>
                  İptal et
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SettingsMenuForComment;
