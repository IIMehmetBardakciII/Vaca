"use client";
import { Input } from "@/components/ui/input";
import { actionThePost } from "@/lib/actions/actionThePost";
import Image from "next/image";
import { useState } from "react";

type CommentAreaType = {
  userProfilePictureUrl: string;
  userId: string;
  postId: number;
  virtualAcademyId: string;
  collectionName: "Posts" | "ForumPosts";
};
const CommentArea = ({
  userProfilePictureUrl,
  userId,
  postId,
  virtualAcademyId,
  collectionName,
}: CommentAreaType) => {
  const [commentText, setCommentText] = useState<string>("");

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    await actionThePost({
      userId,
      commentText,
      postId: String(postId),
      type: "Comment",
      virtualAcademyId,
      collectionName,
    });
    setCommentText("");
  };

  return (
    <div className="px-4 mb-4">
      {/* Comment input area */}
      <div className="flex items-center">
        <div className="w-12 h-12 relative px-2 ">
          <Image
            src={userProfilePictureUrl}
            alt="userProfilePicture"
            fill
            className="object-cover"
          />
        </div>
        <Input
          onChange={(e) => setCommentText(e.target.value)}
          value={commentText}
          placeholder="Yorum ekle..."
          className="flex-grow rounded-full   focus-visible:ring-offset-0 focus-visible:ring-transparent focus-visible:border-gray-400"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleCommentSubmit();
            }
          }}
        />
        <button
          onClick={handleCommentSubmit}
          className="text-xs ml-1  px-2 font-bold text-white bg-blue-500 hover:bg-primary transition-all ease-in-out duration-100 rounded-full py-1"
        >
          Paylaş
        </button>
      </div>
    </div>
  );
};

export default CommentArea;
