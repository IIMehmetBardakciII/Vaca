"use client";
import { Button } from "@/components/ui/button";
import { getPostComments } from "@/lib/actions/getPostComments";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import SettingsMenuForComment from "./SettingsMenuForComment";
import EditCommentInput from "./EditCommentInput";
type CommentBoxType = {
  postId: number;
  virtualAcademyId: string;
  userId: string;
  commentsData: any;
  collectionName: "Posts" | "ForumPosts";
};
const CommentsBox = ({
  postId,
  virtualAcademyId,
  userId,
  commentsData,
  collectionName,
}: CommentBoxType) => {
  const [visibleComments, setVisibleComments] = useState<number>(3);
  const [openEditPanels, setOpenEditPanels] = useState<{
    [key: string]: boolean;
  }>({});

  const isOwnComments = (userId: string, commentsOwnId: string) => {
    if (userId === commentsOwnId) return true;
  };

  const toggleEditPanel = (commentId: string) => {
    setOpenEditPanels((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  if (!commentsData) {
    return <div>Yorumlar yükleniyor...</div>; // Yükleme sırasında gösterilecek mesaj
  }
  return (
    <div className="px-4 mb-2 flex flex-col gap-2">
      {commentsData
        ?.slice(0, visibleComments)
        .map((commentDetail: any, index: number) => (
          <div
            key={index}
            className="flex bg-gray-400/15 rounded-md w-full h-fit p-2 "
          >
            <div className="w-8 h-8 relative flex">
              <Image
                src={commentDetail.user?.profilePicture}
                alt="profilePicture"
                fill
              />
            </div>
            <div className="flex gap-4 flex-col w-full ">
              <div className="flex  justify-between w-full ">
                <div className="flex gap-2  flex-col">
                  <p className="text-[16px] leading-[18px] font-bold">
                    {commentDetail?.user?.username}
                  </p>
                  <span className="text-xs leading-[0px] text-muted-foreground">
                    {commentDetail.user?.email}
                  </span>
                </div>
                <div className="flex items-center ">
                  <span className="text-xs  text-muted-foreground ">
                    {typeof commentDetail.createdAt === "object" &&
                    commentDetail.createdAt?.seconds
                      ? new Date(
                          commentDetail.createdAt.seconds * 1000
                        ).toLocaleString()
                      : commentDetail.createdAt}
                  </span>
                  <div>
                    {isOwnComments(userId, commentDetail.userId) && (
                      <SettingsMenuForComment
                        onClickForEdit={() =>
                          toggleEditPanel(commentDetail.commentId)
                        }
                        onClickForDelete={() =>
                          toggleEditPanel(commentDetail.commentId)
                        }
                        postId={postId}
                        commentId={commentDetail.commentId}
                        virtualAcademyId={virtualAcademyId}
                        collectionName={collectionName}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div>
                <span className="text-[14px] leading-[0px]">
                  {commentDetail.commentText}
                </span>
                {openEditPanels[commentDetail.commentId] && (
                  <EditCommentInput
                    commentId={commentDetail.commentId}
                    postId={postId}
                    virtualAcademyId={virtualAcademyId}
                    prevComment={commentDetail.commentText}
                    onClickForEdit={() =>
                      toggleEditPanel(commentDetail.commentId)
                    }
                    collectionName={collectionName}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      <Button
        onClick={() =>
          setVisibleComments(visibleComments === 3 ? commentsData.length : 3)
        }
        asChild
        className="justify-start w-fit flex gap-1"
      >
        <p className="cursor-pointer hover:bg-blue-400 hover:text-white ">
          <ExternalLink size={18} />
          <span className="text-lg ">
            {visibleComments === 3
              ? "Tüm yorumları gör"
              : "Tüm yorumları kapat   "}
          </span>
        </p>
      </Button>
    </div>
  );
};

export default CommentsBox;
