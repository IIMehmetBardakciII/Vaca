import { getUserData } from "@/lib/actions/UserData";
import ProfilePicture from "./_components/ProfilePicture";
import { getVirtualAcademyData } from "@/lib/actions/getVirtualAcademyData";
import Image from "next/image";
import Link from "next/link";

const ProfilePage = async ({ params }: { params: { profileid: string } }) => {
  // URL'den gelen profileid'yi decode ediyoruz
  const decodedProfileId = decodeURIComponent(params.profileid);
  const userData = await getUserData(decodedProfileId);
  // Kullanıcının virtualAcademyId'lerini alıyoruz
  const academyIds = userData.virtualAcademies.map(
    (academy: any) => academy.virtualAcademyId
  );

  // Her bir virtualAcademyId için verileri getiriyoruz
  const academyDataPromises = academyIds.map(async (id: string) => {
    return await getVirtualAcademyData(id);
  });

  // Promise'leri topluca bekleyip sonuçları alıyoruz
  const academyData = await Promise.all(academyDataPromises);

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
        {academyData.map((academyData, index) => {
          //* İki Kere yapılan map işleminin önüne geçmek tekrarı engellemek role yazısında
          const userAcademy = userData.virtualAcademies.find(
            (userAcademy: any) =>
              userAcademy.virtualAcademyId === academyData.id
          );
          return (
            <Link
              key={index}
              href={`/virtual-academy/${academyData.id}`}
              className="w-1/2 border rounded cursor-pointer group hover:bg-primary transition-all ease-in-out flex justify-between p-3"
            >
              <div key={index} className="flex justify-between w-full">
                <div className="flex gap-4 items-center ">
                  {/* Academy Profile */}
                  <div className="w-10 h-10 rounded-full bg-secondary relative">
                    <Image
                      src={academyData.imageFileUrl}
                      alt="AcademyPic"
                      fill
                    />
                  </div>
                  {/* Academy Name */}
                  {/* Academy Role */}
                  <div className="flex flex-col gap-1">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight group-hover:text-secondary">
                      {academyData.academyName}
                    </h4>

                    <small
                      className="text-sm font-medium leading-none text-gray-500"
                      key={index}
                    >
                      Rol: <span>{userAcademy.role}</span>
                    </small>
                  </div>
                </div>
                {/* Öğrenci sayısı */}
                <div className="flex items-center">
                  <small className="text-sm font-medium leading-none text-gray-500">
                    Öğrenci Sayısı: <span>{academyData.numberOfStudents}</span>
                  </small>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {/* ** */}
    </div>
  );
};

export default ProfilePage;
