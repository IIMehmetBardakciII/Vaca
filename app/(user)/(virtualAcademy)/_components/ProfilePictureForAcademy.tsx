"use client";
import { Button } from "@/components/ui/button";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type ProfilePictureForAcademyProps = {
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
};
const ProfilePictureForAcademy = ({
  setImageFile,
}: ProfilePictureForAcademyProps) => {
  // Anlık görüntüleme için kullanılan state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // storage a yüklemek için kullanılan state
  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // local url oluşturuyoruz.
      setSelectedImage(imageUrl);
      setImageFile(file);
    }
  };
  return (
    <>
      <div className="w-32 h-32 rounded-full bg-secondary group  relative mx-auto overflow-hidden">
        {/* Profil resmi veya seçilen resim */}
        {selectedImage ? (
          <div className="w-full h-full relative">
            <Image
              src={selectedImage} // Önce seçilen resim varsa, yoksa userProfilePicture kullanıyoruz.
              alt="ProfilePicture"
              fill // Resmi kapsayıcının tamamını doldurması için layout="fill" kullanıyoruz.
              // width={128}
              // height={128}
              className="rounded-full object-cover" // Yuvarlak çerçeve.
            />
          </div>
        ) : (
          <CircleUserRound className="w-32 h-32 object-contain group-hover:opacity-50" />
        )}

        {/* Inputu görünmez yapıp resmin arka planına tıklanabilir alan ekliyoruz */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="profile-picture-input"
          onChange={handleImageFileChange} // Resim değişikliği işlemi.
        />
        <label
          htmlFor="profile-picture-input"
          className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-xs"
        >
          Akademin İçin Logo Belirle
        </label>
      </div>
      {/* Butonlar */}
      {selectedImage && (
        <div className="flex items-center justify-center gap-2 mt-1">
          <Button onClick={() => setSelectedImage("")} variant={"destructive"}>
            İptal
          </Button>
        </div>
      )}
    </>
  );
};

export default ProfilePictureForAcademy;
