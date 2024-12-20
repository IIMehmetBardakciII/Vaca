import { Input } from "@/components/ui/input";
import { actionThePost } from "@/lib/actions/actionThePost";
import { useState } from "react";

type EditCommentInputType = {
  prevComment: string;
  commentId: string;
  postId: number;
  virtualAcademyId: string;
  onClickForEdit: () => void;
  collectionName: "Posts" | "ForumPosts";
};
const EditCommentInput = ({
  prevComment,
  commentId,
  postId,
  virtualAcademyId,
  onClickForEdit,
  collectionName,
}: EditCommentInputType) => {
  const [editCommentText, setEditCommentText] = useState<string>("");
  return (
    <div className="flex items-center">
      <Input
        onChange={(e) => setEditCommentText(e.target.value)}
        value={editCommentText || prevComment}
      />
      <button
        onClick={async () => {
          await actionThePost({
            commentText: editCommentText,
            postId: String(postId),
            type: "EditComment",
            virtualAcademyId,
            collectionName,
            commentId,
          });

          setEditCommentText("");
          onClickForEdit();
        }}
        className="text-xs h-full ml-1  px-2 py-1 font-bold text-white bg-green-500 hover:bg-primary transition-all ease-in-out duration-100 rounded-full "
      >
        Paylaş
      </button>
    </div>
  );
};

export default EditCommentInput;
