import AcademyNav from "@/components/organism/AcademyNav";
import GlobalChat from "@/components/organism/GlobalChat";
import CreatePost from "@/components/organism/Post/CreatePost";
import Post from "@/components/organism/Post/Post";
import { getRole } from "@/lib/actions/AcademyRole";
import { getVirtualAcademyData } from "@/lib/actions/getVirtualAcademyData";
import { getVirtualAcademyPosts } from "@/lib/actions/getVirtualAcademyPosts";
import "react-datepicker/dist/react-datepicker.css";

const AcademyDashboard = async ({ params }: { params: { id: string } }) => {
  const [virtualAcademyData, role, posts] = await Promise.all([
    getVirtualAcademyData(params.id),
    getRole(params.id),
    getVirtualAcademyPosts(params.id, "Posts"),
  ]);
  // const virtualAcademyData = getVirtualAcademyData(params.id);
  // const role = getRole(params.id);
  // await Promise.all([virtualAcademyData, role]);

  if (!virtualAcademyData) {
    return <div>Academy Bulunamadı</div>;
  }

  // const { id, academyName, members, imageFileUrl,numberOfStudents,joinRequests } = virtualAcademyData;

  return (
    <div className="h-[4000px] relative">
      {/* AcademyNav */}

      {/* For Post & Chat Area */}
      <div className="flex   relative h-fit mt-10 ">
        {/* SuccessLearnerArea & OtherAcademies */}
        <div className="flex-[1] ">
          <AcademyNav
            role={role}
            virtualAcademyData={{
              id: virtualAcademyData.id,
              academyName: virtualAcademyData.academyName,
              members: virtualAcademyData.members,
              numberOfStudents: virtualAcademyData.numberOfStudents,
              joinRequests: virtualAcademyData.joinRequests,
              imageFileUrl: virtualAcademyData.imageFileUrl,
            }}
          />
        </div>

        {/* PostArea */}
        <div className=" flex-[1]  gap-5 flex flex-col  items-center   relative ">
          {/* CreatePostModal */}
          {(role === "Rektor" || role === "Educator") && (
            <CreatePost
              virtualAcademyId={virtualAcademyData.id}
              collectionName="Posts"
            />
          )}

          {posts.length > 0
            ? posts.map((post) => (
                <Post
                  key={post.postId}
                  postData={post}
                  virtualAcademyId={virtualAcademyData.id}
                  collectionName="Posts"
                />
              ))
            : ""}

          {/* AllPostMap */}
        </div>
        {/* PostArea */}

        {/* ChatArea */}
        <div className="flex-[1]  ">
          <GlobalChat
            virtualAcademyData={{
              id: virtualAcademyData.id,
              academyName: virtualAcademyData.academyName,
              members: virtualAcademyData.members,
              imageFileUrl: virtualAcademyData.imageFileUrl,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AcademyDashboard;
