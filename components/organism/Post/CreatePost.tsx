"use client";
import useUser from "@/lib/hooks/useUser";
import Image from "next/image";
import PostForm from "./PostForm";
import { useState } from "react";

type CreatePostType = {
  virtualAcademyId: string;
  collectionName: string;
};
const CreatePost = ({ virtualAcademyId, collectionName }: CreatePostType) => {
  const { userData } = useUser();

  const [openPostForm, setOpenPostForm] = useState<boolean>(false);
  return (
    <div className="w-full">
      {/* İmage */}
      {/* ToggleForPost Gönderi başlatın */}
      <div className="flex items-center gap-4 bg-gray-50 rounded-md border">
        <div className="w-20   h-20 relative">
          <Image
            src={userData?.profilePicture || "/deneme.jpg"}
            alt="deneme"
            fill
            className="object-cover"
          />
        </div>
        <span
          onClick={() => setOpenPostForm(true)}
          className="w-[450px] border text-slate-600 hover:bg-gray-100  cursor-pointer text-lg font-medium  px-4 py-2 rounded-full"
        >
          Gönderi Başlatın
        </span>
      </div>
      <div>
        {openPostForm && userData?.email && (
          <PostForm
            collectionName={collectionName}
            userEmail={userData?.email}
            virtualAcademyId={virtualAcademyId}
            open={openPostForm}
            onClose={() => setOpenPostForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CreatePost;
