import UserCard from "@/components/organism/GetAllUsers/UserCard";
import { getCookies } from "@/lib/actions/Cookies";
import { getAllMembers } from "@/lib/actions/Member";
import { getUserData } from "@/lib/actions/UserData";
import Image from "next/image";

const GetAllUsers = async ({ params }: { params: { id: string } }) => {
  const { verifiedToken } = await getCookies();
  const members = await getAllMembers(params.id);
  const filteredMembers = members.filter(
    (member: any) => member.userId !== verifiedToken?.email
  );
  const userData = await Promise.all(
    filteredMembers.map((member: any) => getUserData(member.userId))
  );

  // filteredMembers ile userData eşleştirme
  const membersWithUserData = filteredMembers.map(
    (member: any, index: number) => ({
      ...member,
      username: userData[index]?.username,
      profilePicture: userData[index]?.profilePicture,
    })
  );

  return (
    <div className="w-full ">
      {/* Academy Profile Picture */}

      <div className="flex items-center flex-col">
        <div className="w-28 h-28 relative">
          <Image
            src="/deneme.jpg"
            alt="profilePicture"
            fill
            className="object-cover rounded-full"
          />
        </div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Bartın Akademi
        </h3>
      </div>
      <div className="grid sm:grid-cols-4 grid-cols-1 gap-4 mt-2">
        {membersWithUserData.map((member: any) => (
          <UserCard
            key={member.userId}
            userId={member.userId}
            role={member.role}
            username={member.username}
            profilePictureUrl={member.profilePicture}
            academyId={params.id}
          />
        ))}
      </div>
    </div>
  );
};

export default GetAllUsers;
