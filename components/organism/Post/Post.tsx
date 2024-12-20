import CommentButton from "@/components/utilities/CommentButton";
import LikeButton from "@/components/utilities/LikeButton";
import { PostType } from "@/lib/actions/getVirtualAcademyPosts";
import { getUserData } from "@/lib/actions/UserData";
import { Timestamp } from "firebase/firestore";
import { ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CommentArea from "./CommentArea";
import CommentsBox from "./CommentsBox";
import { getPostComments } from "@/lib/actions/getPostComments";

type PostProps = {
  postData: PostType; // Post verisini alacak prop
  virtualAcademyId: string;
  collectionName: "Posts" | "ForumPosts";
};

const Post = async ({
  postData,
  virtualAcademyId,
  collectionName,
}: PostProps) => {
  // const userData = await getUserData(postData.createdBy);
  // const commentsData = await getPostComments({
  //   postId: String(postData.postId),
  //   virtualAcademyId,
  //   collectionName: "Posts",
  // });

  const [userData, commentsData] = await Promise.all([
    getUserData(postData.createdBy),
    getPostComments({
      postId: String(postData.postId),
      virtualAcademyId,
      collectionName,
    }),
  ]);
  const userIsLiked = postData.reactions.includes(userData.email);

  // Eğer Firebase Timestamp ise, Date objesine dönüştürme
  const postDate =
    postData.createdAt instanceof Timestamp
      ? postData.createdAt.toDate() // Firebase Timestamp'ten Date objesine dönüştürme
      : new Date(); // Eğer geçerli değilse, bugünün tarihini al
  return (
    <div className="w-full relative h-fit bg-gray-50  rounded-md border">
      <div className="p-4">
        <div className="flex gap-4 mb-4 h-[80px]  items-center">
          <div className="w-[80px] h-full relative rounded-full bg-slate-200 ">
            <Image
              src={userData.profilePicture}
              alt="profilePicture"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="group">
            <Link href={`/profile/${userData.email}`}>
              <h4 className="scroll-m-20 text-lg font-semibold tracking-tight group-hover:underline">
                {userData.username}
              </h4>
              <p className="text-xs text-muted-foreground">{userData.email}</p>
            </Link>
            <p className="text-xs text-muted-foreground">
              {postDate.toLocaleDateString("tr-TR")}
            </p>
          </div>
        </div>
        {/* content */}
        {/* Content kısmını HTML olarak render et */}
        <div
          className="text-base font-medium"
          dangerouslySetInnerHTML={{ __html: postData.content }}
        />
      </div>
      <div className="w-full h-[400px] bg-secondary relative ">
        <Image
          src={`${postData.imageUrl}`}
          alt="AcademyPic"
          fill
          className="object-center"
        />
      </div>

      <div className="px-4 py-2  mb-4">
        <div className="flex justify-between border-b">
          {/* Reaction */}
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <ThumbsUp size={12} className="stroke-gray-200" />
            </div>
            <p className="text-base font-thin text-muted-foreground">
              {postData.reactions.length}
            </p>
          </div>
          {/* Comments Number */}
          <p className="text-base font-thin text-muted-foreground">
            {postData.comments.length} yorum
          </p>
        </div>
      </div>
      {/* Button for comment & like */}
      <div className="w-full mb-2 flex items-center justify-center">
        <LikeButton
          userId={userData.email}
          postId={postData.postId}
          virtualAcademyId={virtualAcademyId}
          isLiked={userIsLiked}
          collectionName={collectionName}
        />
        <CommentButton />
      </div>
      <CommentArea
        userProfilePictureUrl={userData?.profilePicture}
        userId={userData.email}
        postId={postData.postId}
        virtualAcademyId={virtualAcademyId}
        collectionName={collectionName}
      />
      <CommentsBox
        collectionName={collectionName}
        postId={postData.postId}
        virtualAcademyId={virtualAcademyId}
        userId={userData.email}
        commentsData={commentsData}
      />
    </div>
  );
};

export default Post;
