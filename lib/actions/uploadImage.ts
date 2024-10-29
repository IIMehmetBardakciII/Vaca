"use server";
import { v4 as uuidv4 } from "uuid";
import { initAdmin } from "../firebaseAdmin/config";
import admin from "firebase-admin";

export async function uploadImageToFirebase(imageFile: File): Promise<string> {
  initAdmin();
  const storage = admin.storage().bucket(); // Firebase Admin SDK'da storage bucket referansı
  const uniqueFileName = `academyPictures/${uuidv4()}`;
  const fileRef = storage.file(uniqueFileName);

  // Dosyayı buffer olarak okuyun ve storage'a yükleyin
  const buffer = Buffer.from(await imageFile.arrayBuffer());
  await fileRef.save(buffer, {
    contentType: imageFile.type,
  });

  await fileRef.makePublic();

  // Dosyanın URL'sini oluşturun
  const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${
    storage.name
  }/o/${encodeURIComponent(uniqueFileName)}?alt=media`;

  return downloadURL;
}
