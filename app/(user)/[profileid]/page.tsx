import { getUserData } from "@/lib/actions/UserData";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import ProfilePicture from "./_components/ProfilePicture";

const ProfilePage = async ({ params }: { params: { profileid: string } }) => {
  // URL'den gelen profileid'yi decode ediyoruz
  const decodedProfileId = decodeURIComponent(params.profileid);
  const userData = await getUserData(decodedProfileId);

  return (
    <div className="flex  flex-col items-center gap-2">
      {/* Profile Alanı */}
      <div>
        <ProfilePicture
          userEmail={userData.email}
          userProfilePicture={userData.profilePicture}
        />
        {/* İnputa dönücek file alıp storage a yüklücez. */}
      </div>
      {/* İnfo */}
      {/*Kullanıcı adı */}
      <div className="flex flex-col gap-2">
        {" "}
        <small className="text-sm font-medium leading-none text-foreground justify-start ">
          Kullanıcı adı: <span className="font-bold">{userData.username}</span>
        </small>
        {/*Kullanıcı email */}
        <small className="text-sm font-medium leading-none text-foreground justify-start ">
          Mail adresi: <span className="font-bold">{userData.email}</span>
        </small>
      </div>
      {/* Sanal Akademilerim */}
      <h3 className="scroll-m-20 text-2xl font-medium tracking-tight border-b w-fit mb-2 mt-4">
        Sanal Akademilerim
      </h3>

      <div className="flex w-full items-center  flex-col gap-2 ">
        <div className="w-1/2 border rounded cursor-pointer group hover:bg-primary transition-all ease-in-out flex justify-between p-3">
          <div className="flex gap-4 items-center ">
            {/* Academy Profile */}

            <div className="w-10 h-10 rounded-full bg-secondary"></div>
            {/* Academy Name */}
            {/* Academy Role */}
            <div className="flex flex-col gap-1">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight group-hover:text-secondary">
                Web Development 101
              </h4>
              <small className="text-sm font-medium leading-none text-gray-500">
                Rol: <span>Öğrenci</span>
              </small>
            </div>
          </div>

          {/* Öğrenci sayısı */}
          <div className="flex items-center">
            <small className="text-sm font-medium leading-none text-gray-500">
              Öğrenci Sayısı: <span>25</span>
            </small>
          </div>
        </div>
        <div className="w-1/2 border rounded cursor-pointer group hover:bg-primary transition-all ease-in-out flex justify-between p-3">
          <div className="flex gap-4 items-center ">
            {/* Academy Profile */}

            <div className="w-10 h-10 rounded-full bg-secondary"></div>
            {/* Academy Name */}
            {/* Academy Role */}
            <div className="flex flex-col gap-1">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight group-hover:text-secondary">
                Konoha Academy
              </h4>
              <small className="text-sm font-medium leading-none text-gray-500">
                Rol: <span>Eğitmen</span>
              </small>
            </div>
          </div>

          {/* Öğrenci sayısı */}
          <div className="flex items-center">
            <small className="text-sm font-medium leading-none text-gray-500">
              Öğrenci Sayısı: <span>15</span>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
