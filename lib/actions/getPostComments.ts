"use server";

import { doc, getDoc } from "firebase/firestore";
import { initializeFirebaseClient } from "../firebaseClient/config";
import { PostType } from "./getVirtualAcademyPosts";
import { getUserData } from "./UserData";
import { revalidatePath } from "next/cache";

type getPostCommentsType = {
  postId: string;
  virtualAcademyId: string;
  collectionName: string;
};
export async function getPostComments({
  postId,
  virtualAcademyId,
  collectionName,
}: getPostCommentsType) {
  try {
    const { db } = initializeFirebaseClient();
    const postDocRef = doc(db, collectionName, virtualAcademyId);
    const postSnapshot = await getDoc(postDocRef);
    if (!postSnapshot.exists()) {
      throw new Error(
        "Döküman bulunamadı bu hata getPostComments.ts den geliyor"
      );
    }
    const posts = postSnapshot.data().posts;
    if (!Array.isArray(posts)) {
      throw new Error("Post bir dizi değil");
    }

    const targetPost = posts.find(
      (post: PostType) => String(post.postId) === postId
    );
    if (!targetPost) throw new Error("Post bulunamadı");
    // Kullanıcı verileri ve yorumları almak için map kullanılıyor
    const commentsWithUserData = await Promise.all(
      targetPost.comments.map(async (comment: any) => {
        // Kullanıcı verilerini almak
        const userData = await getUserData(comment.userId);
        // Yorum ve kullanıcı verilerini birleştiriyoruz
        return {
          ...comment, // mevcut comment verileri
          user: userData, // kullanıcı verileri
        };
      })
    );

    const sortedComments = commentsWithUserData.sort(
      (a, b) => b.createdAt.seconds - a.createdAt.seconds
    );
    revalidatePath(`/virtual-academy/${virtualAcademyId}`);
    return sortedComments;

    // return commentsWithUserData;
  } catch (error) {
    console.error("Bu hata getPostComments.ts den geliyor , Hata: ", error);
  }
}
