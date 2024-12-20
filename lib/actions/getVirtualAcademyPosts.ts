"use server";

import { doc, getDoc } from "firebase/firestore";
import { initializeFirebaseClient } from "../firebaseClient/config";

// Firestore'dan dönen post verisinin tipi
export interface PostType {
  postId: number;
  content: string;
  imageUrl?: string;
  comments: string[];
  reactions: string[];
  createdBy: string;
  createdAt: Date;
}

interface PostDocument {
  posts: PostType[];
}
export async function getVirtualAcademyPosts(
  virtualAcademyId: string,
  collectionName: string
) {
  try {
    const { db } = initializeFirebaseClient();
    const postRef = doc(db, collectionName, virtualAcademyId);
    const postSnapshot = await getDoc(postRef);
    if (postSnapshot.exists()) {
      const postData = postSnapshot.data() as PostDocument;
      return postData.posts || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error(
      "Postlar getirilemedi bu hata getVirtualAcademyPosts.ts den geliyor",
      error
    );
    return []; // Hata durumunda boş dizi döndürmek de iyi bir yaklaşım olabilir
  }
}
