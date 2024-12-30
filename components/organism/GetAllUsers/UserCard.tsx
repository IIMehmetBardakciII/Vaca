import Image from "next/image";
import UserAssignButton from "./UserAssignButton";
import UserDeleteButton from "./UserDeleteButton";

type userCardType = {
  userId: string;
  role: string;
  username: string;
  profilePictureUrl: string;
  academyId: string;
};
const UserCard = ({
  userId,
  role,
  username,
  profilePictureUrl,
  academyId,
}: userCardType) => {
  return (
    <div className="w-full flex flex-col items-center justify-center  h-fit bg-secondary p-2 rounded-md ">
      {/* UserProfilePicture */}
      <div className="w-16 h-16 relative flex  border-2 rounded-full ">
        <Image
          src={profilePictureUrl || "/deneme.jpg"}
          alt="profilePicture"
          fill
          className="object-cover rounded-full"
        />
      </div>

      <div className="flex gap-4 mt-2 ">
        <div>
          <small className="text-sm font-medium leading-none text-muted-foreground">
            Kullanıcı Adı:
          </small>
          <small className="text-sm font-medium leading-none">{username}</small>
        </div>
        <div>
          <small className="text-sm font-medium leading-none text-muted-foreground">
            Rol:
          </small>
          <small className="text-sm font-medium leading-none">{role}</small>
        </div>
      </div>
      {/* UserName */}
      {/* User Role */}
      {/* Edit Buttons ---> Ata,Sil */}
      <div className="flex items-center gap-2 mt-2">
        <UserAssignButton
          userId={userId}
          role={role}
          userName={username}
          academyId={academyId}
        />
        <UserDeleteButton userId={userId} academyId={academyId} />
      </div>
    </div>
  );
};

export default UserCard;
