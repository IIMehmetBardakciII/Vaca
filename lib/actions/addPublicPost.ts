"use server";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { initializeFirebaseClient } from "../firebaseClient/config";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

type AddPublicPost = {
  virtualAcademyId: string;
  content: string;
  imageUrl?: string;
  userEmail: string;
  collectionName: string;
};

// Firestore'dan dönen post verisinin tipi
interface Post {
  postId: number;
  content: string;
  imageUrl?: string;
  comments: string[];
  createdAt: Date;
}

interface PostDocument {
  posts: Post[];
}

export async function addPublicPost({
  virtualAcademyId,
  content,
  imageUrl,
  userEmail,
  collectionName,
}: AddPublicPost) {
  try {
    const { db } = initializeFirebaseClient();
    const postRef = doc(db, collectionName, virtualAcademyId);

    // Mevcut postları almak
    const currentPosts = await getCurrentPosts(postRef);

    // Yeni post objesini oluşturuyoruz
    const newPost = {
      postId: uuidv4(),
      content,
      imageUrl,
      comments: [],
      reactions: [],
      createdBy: userEmail,
      createdAt: new Date(),
    };

    // Eğer döküman mevcut değilse, setDoc ile oluşturuyoruz
    if (currentPosts.length === 0) {
      await setDoc(postRef, {
        posts: [newPost], // İlk postu ekliyoruz
      });
    } else {
      // Eğer döküman varsa, updateDoc ile mevcut postlara yeni postu ekliyoruz
      await setDoc(postRef, {
        posts: [...currentPosts, newPost], // Yeni postu ekliyoruz
      });
    }

    console.log("Post başarıyla eklendi");
    revalidatePath(`/virtual-academy/${virtualAcademyId}`);
  } catch (error) {
    console.error(
      "Post eklerken hata bu hata addPublicPost.ts den geliyor",
      error
    );
  }
}

// Mevcut postları almak için bir yardımcı fonksiyon
async function getCurrentPosts(postRef: any): Promise<Post[]> {
  const postSnapshot = await getDoc(postRef);
  if (postSnapshot.exists()) {
    const postData = postSnapshot.data() as PostDocument; // Tip ataması
    return postData?.posts || []; // Eğer posts varsa, mevcut postları döndür
  } else {
    return []; // Eğer döküman yoksa, boş bir dizi döndür
  }
}
