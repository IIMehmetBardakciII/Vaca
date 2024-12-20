"use server";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeFirebaseClient } from "../firebaseClient/config";
import { PostType } from "./getVirtualAcademyPosts";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

type actionThePost = {
  userId?: string;
  commentText?: string;
  postId: string;
  type: "Like" | "Comment" | "EditComment" | "DeleteComment";
  virtualAcademyId: string;
  collectionName: "Posts" | "ForumPosts";
  commentId?: string;
};

export async function actionThePost({
  userId,
  commentText,
  postId,
  type,
  virtualAcademyId,
  collectionName,
  commentId,
}: actionThePost) {
  try {
    const { db } = initializeFirebaseClient();
    const postDocRef = doc(db, collectionName, virtualAcademyId);
    const postSnapshot = await getDoc(postDocRef);

    if (!postSnapshot.exists()) {
      throw new Error("Doküman bulunamadı.");
    }

    const posts = postSnapshot.data().posts;
    if (!Array.isArray(posts)) {
      throw new Error("Posts bir dizi değil.");
    }

    switch (type) {
      case "Like":
        if (userId) {
          await handleLike(posts, userId, postId, postDocRef);
          revalidatePath(`/virtual-academy/${virtualAcademyId}`);
        }
        break;
      case "Comment":
        if (commentText && userId) {
          await handleComment(posts, userId, postId, commentText, postDocRef);
          revalidatePath(`/virtual-academy/${virtualAcademyId}`);
        }
        break;
      case "EditComment":
        if (commentText && commentId) {
          await handleEditComment(
            posts,
            postId,
            commentText,
            postDocRef,
            commentId
          );
        }
        revalidatePath(`/virtual-academy/${virtualAcademyId}`);
        break;
      case "DeleteComment":
        if (commentId) {
          await handleDeleteComment(posts, postId, postDocRef, commentId);
        }
        revalidatePath(`/virtual-academy/${virtualAcademyId}`);
        break;
      default:
        break;
    }
    // if (type === "Like") {

    // } else if (type === "Comment" && commentText) {

    // }
  } catch (error) {
    console.error("Bu hata actionThePost.ts den geliyor, Hata:", error);
  }
}

//* Like işlemini yapan fonksiyon
async function handleLike(
  posts: PostType[],
  userId: string,
  postId: string,
  postDocRef: any
) {
  const targetPost = findTargetPost(posts, postId);

  const reactions = targetPost.reactions || [];
  const isUserLiked = reactions.includes(userId);

  const updatedReactions = isUserLiked
    ? reactions.filter((id: string) => id !== userId) // Beğeniden vazgeçme
    : [...reactions, userId]; // Beğenme işlemi

  const updatedPosts = posts.map((post: PostType) => {
    if (String(post.postId) === postId) {
      return { ...post, reactions: updatedReactions };
    }
    return post;
  });

  // Güncelleme işlemi
  await updateDoc(postDocRef, {
    posts: updatedPosts,
  });
}

//* Comment işlemini yapan fonksiyon
async function handleComment(
  posts: PostType[],
  userId: string,
  postId: string,
  commentText: string,
  postDocRef: any
) {
  const targetPost = findTargetPost(posts, postId);

  const comments = targetPost.comments || [];
  const newComment = {
    userId,
    commentText,
    createdAt: new Date(),
    commentId: uuidv4(),
  };

  const updatedComments = [...comments, newComment];

  const updatedPosts = posts.map((post: PostType) => {
    if (String(post.postId) === postId) {
      return { ...post, comments: updatedComments };
    }
    return post;
  });

  // Güncelleme işlemi
  await updateDoc(postDocRef, {
    posts: updatedPosts,
  });
}

//* Edit comment
async function handleEditComment(
  posts: PostType[],
  postId: string,
  commentText: string,
  postDocRef: any,
  commentId: string
) {
  const targetPost = findTargetPost(posts, postId);
  const targetComment = findComment(commentId, targetPost.comments);
  const updatedComment = {
    ...targetComment,
    commentText: commentText,
  };

  // Güncellenmiş yorum dizisini oluştur
  const updatedComments = targetPost.comments.map((comment: any) =>
    comment.commentId === commentId ? updatedComment : comment
  );

  // Hedef postun yorumlarını güncelle
  const updatedPost = {
    ...targetPost,
    comments: updatedComments,
  };

  // Tüm postlar dizisini güncelle
  const updatedPosts = posts.map((post: PostType) =>
    String(post.postId) === postId ? updatedPost : post
  );

  // Firebase'e güncellemeyi gönder
  await updateDoc(postDocRef, {
    posts: updatedPosts,
  });
}
//* DeleteComment

async function handleDeleteComment(
  posts: PostType[],
  postId: string,
  postDocRef: any,
  commentId: string
) {
  const targetPost = findTargetPost(posts, postId);
  // Filtreleme işlemi
  const updatedComments = targetPost.comments.filter(
    (comments: any) => comments.commentId !== commentId
  );

  const updatedPost = {
    ...targetPost,
    comments: updatedComments,
  };

  const updatedPosts = posts.map((post: PostType) =>
    String(post.postId) === postId ? updatedPost : post
  );

  await updateDoc(postDocRef, {
    posts: updatedPosts,
  });
}

// getTargetPost
function findTargetPost(posts: PostType[], postId: string): PostType {
  const targetPost = posts.find(
    (post: PostType) => String(post.postId) === postId
  );
  if (!targetPost) {
    throw new Error("Post bulunamadı");
  }
  return targetPost;
}
// getTargetComment
function findComment(commentId: string, comments: any[]) {
  if (!Array.isArray(comments)) {
    throw new Error(
      "Comments bir dizi değil bu hata findComment fonksiyonunda geliyor"
    );
  }
  const targetComment = comments.find(
    (comment) => comment.commentId === commentId
  );

  return targetComment;
}
