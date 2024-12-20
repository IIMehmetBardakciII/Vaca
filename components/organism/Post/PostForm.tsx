"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CircleX, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import Image from "next/image";

import Picker from "@emoji-mart/react"; // Emoji Mart Picker
import data from "@emoji-mart/data"; // Emoji Mart Data

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // React Quill CSS

import { addPublicPost } from "@/lib/actions/addPublicPost";
import { initializeFirebaseClient } from "@/lib/firebaseClient/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { v4 as uuidv4 } from "uuid";

// React Quill'i SSR (Server-Side Rendering) sorunlarından kaçınmak için dinamik import ediyoruz.
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type PostModalProps = {
  open: boolean;
  onClose: () => void;
  virtualAcademyId: string;
  userEmail: string;
  collectionName: string;
};
const PostForm = ({
  userEmail,
  open,
  onClose,
  virtualAcademyId,
  collectionName,
}: PostModalProps) => {
  const imageFileRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [content, setContent] = useState<string>(""); // Post içeriği
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false); // Emoji picker görünürlüğü

  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setContent((prev) => prev + emoji.native); // Emojiyi içeriğe ekler
    setShowEmojiPicker(false); // Emoji picker'ı kapatır
  };

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const postImage = formData.get("postImage") as File;
    let imageDownloadURL = "";
    if (postImage) {
      imageDownloadURL = await uploadImageToStorage(postImage);
    }

    await addPublicPost({
      virtualAcademyId,
      content,
      imageUrl: imageDownloadURL || undefined, // sadece URL'yi gönderiyoruz
      userEmail,
      collectionName,
    });

    setLoading(false);
    onClose();
  };

  const uploadImageToStorage = async (imageFile: File) => {
    // Firebase storage'ı başlatıyoruz
    const { storage } = initializeFirebaseClient();
    const uniqueFileName = `${uuidv4()}-${imageFile.name}`;
    const storageRef = ref(
      storage,
      `postvirtualAcademy${virtualAcademyId}/${uniqueFileName}`
    );

    // Upload işlemi
    const snapshot = await uploadBytesResumable(storageRef, imageFile);

    // Dosya yüklemesi tamamlandığında URL'i alıyoruz
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handlePostSubmit}>
          <DialogTitle>Gönderini Oluştur</DialogTitle>
          <ReactQuill
            value={content}
            onChange={setContent}
            placeholder="Ne hakkında konuşmak istersin?"
            className="mt-2 mb-8"
          />

          <Input
            ref={imageFileRef}
            type="file"
            className="hidden"
            name="postImage"
            onChange={handleImageChange}
          />
          {previewImage && (
            <div className="w-full  relative h-[200px]">
              <Image
                unoptimized
                src={previewImage}
                alt="previewImage"
                className="object-contain w-full"
                fill
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                onClick={() => imageFileRef.current?.click()}
                type="button"
                asChild
                variant={"secondary"}
                className="justify-start cursor-pointer p-2"
              >
                <span className="w-fit">
                  <ImageIcon />
                  {previewImage ? "Change Image" : ""}
                </span>
              </Button>

              {previewImage && (
                <Button
                  onClick={() => setPreviewImage(null)}
                  type="button"
                  asChild
                  variant={"destructive"}
                  className="justify-start cursor-pointer p-2"
                >
                  <span className="w-fit">
                    <CircleX />
                    Remove Image
                  </span>
                </Button>
              )}
              <Button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                type="button"
                variant={"secondary"}
                className="p-2"
              >
                🙂 Emoji
              </Button>
            </div>

            <Button type="submit" className=" w-fit flex  justify-self-end  ">
              Paylaş {loading && <p className="animate-spin">X</p>}
            </Button>
          </div>

          {showEmojiPicker && (
            <div className="absolute  left-[250px] top-[-4px] z-50">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostForm;
