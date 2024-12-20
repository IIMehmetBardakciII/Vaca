"use client";
import { actionThePost } from "@/lib/actions/actionThePost";
import { ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
type LikeButtonType = {
  userId: string;
  postId: number;
  virtualAcademyId: string;
  isLiked: boolean;
  collectionName: "Posts" | "ForumPosts";
};
const LikeButton = ({
  userId,
  postId,
  virtualAcademyId,
  isLiked,
  collectionName,
}: LikeButtonType) => {
  return (
    <Button
      onClick={async () =>
        await actionThePost({
          userId,
          postId: String(postId),
          type: "Like",
          virtualAcademyId,
          collectionName,
        })
      }
      asChild
      variant={isLiked ? "default" : "ghost"}
      className={cn(
        "justify-start w-fit flex gap-1",
        isLiked && "bg-blue-500 text-white"
      )}
    >
      <p className="cursor-pointer hover:bg-blue-400 hover:text-white ">
        <ThumbsUp size={18} className=" " />
        <span className="text-lg ">
          {isLiked ? "Beğenmekten vazgeç" : "Beğen"}
        </span>
      </p>
    </Button>
  );
};

export default LikeButton;
