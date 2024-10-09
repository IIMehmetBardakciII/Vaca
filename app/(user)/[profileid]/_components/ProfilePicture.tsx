"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { updateUserData } from "@/lib/actions/UpdateUserData";
import { initializeFirebaseClient } from "@/lib/firebaseClient/config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type profilePictureProps = {
  userProfilePicture?: string;
  userEmail: string;
};

const ProfilePicture = ({
  userProfilePicture,
  userEmail,
}: profilePictureProps) => {
  // Anlık görüntüleme için kullanılan state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // storage a yüklemek için kullanılan state
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Toast işlemi için hook çağırma
  const { toast } = useToast();

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

  const saveNewProfilePicture = async () => {
    if (!imageFile) return;

    try {
      // Firebase storage'ı başlatıyoruz
      const { storage } = initializeFirebaseClient();
      const uniqueFileName = `${uuidv4()}-${imageFile.name}`;
      const storageRef = ref(storage, `userProfilePictures/${uniqueFileName}`);

      // Upload işlemi
      const snapshot = await uploadBytesResumable(storageRef, imageFile);

      // Dosya yüklemesi tamamlandığında URL'i alıyoruz
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Dosya indirilebilir URL: ", downloadURL);

      // Kullanıcı verisini güncellemek için URL'yi updateUserData'ya gönderiyoruz
      const { success, previousProfilePicture } = await updateUserData(
        downloadURL,
        userEmail
      );
      if (success && previousProfilePicture) {
        const oldProfilePicRef = ref(storage, previousProfilePicture);
        await deleteObject(oldProfilePicRef);
        console.log(
          "Eski profil resmi başarıyla silindi",
          previousProfilePicture
        );
      }
      if (success) {
        toast({
          title: "Profil Güncelleme",
          description: "Profiliniz başarıyla güncellendi",
        });
      } else {
        toast({
          title: "Profil Güncelleme",
          description: "Profiliniz güncellenirken bir hata oluştu.",
        });
      }
    } catch (error) {
      console.error("Profil resmi yüklenirken hata oluştu:", error);
      toast({
        title: "Profil Güncelleme",
        description: "Profil resmi yüklenirken bir hata oluştu.",
      });
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2000 milisaniye = 2 saniye
    }
  };

  return (
    <>
      <div className="w-32 h-32 rounded-full bg-secondary group relative mb-12 overflow-hidden">
        {/* Profil resmi veya seçilen resim */}
        {selectedImage || userProfilePicture ? (
          <div className="w-full h-full relative">
            <Image
              src={selectedImage || userProfilePicture!} // Önce seçilen resim varsa, yoksa userProfilePicture kullanıyoruz.
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
          Profil Resmini Değiştirmek için tıkla
        </label>
      </div>
      {/* Butonlar */}
      {selectedImage && (
        <div className="flex gap-2 mt-2">
          <Button onClick={saveNewProfilePicture}>Profili Kaydet</Button>
          <Button onClick={() => setSelectedImage("")} variant={"destructive"}>
            İptal
          </Button>
        </div>
      )}
    </>
  );
};

export default ProfilePicture;
