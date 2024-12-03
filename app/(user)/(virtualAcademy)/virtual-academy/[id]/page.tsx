import AcademyNav from "@/components/organism/AcademyNav";
import GlobalChat from "@/components/organism/GlobalChat";
import { getRole } from "@/lib/actions/AcademyRole";
import { getVirtualAcademyData } from "@/lib/actions/getVirtualAcademyData";
import Image from "next/image";

const AcademyDashboard = async ({ params }: { params: { id: string } }) => {
  const [virtualAcademyData, role] = await Promise.all([
    getVirtualAcademyData(params.id),
    getRole(params.id),
  ]);
  // const virtualAcademyData = getVirtualAcademyData(params.id);
  // const role = getRole(params.id);
  // await Promise.all([virtualAcademyData, role]);

  if (!virtualAcademyData) {
    return <div>Academy Bulunamadı</div>;
  }

  const { id, academyName, members, imageFileUrl } = virtualAcademyData;

  return (
    <div className="h-[4000px] relative">
      {/* AcademyNav */}
      <AcademyNav role={role} virtualAcademyData={virtualAcademyData} />
      {/* For Post & Chat Area */}
      <div className="flex flex-1  relative h-full mt-10 ">
        {/* SuccessLearnerArea & OtherAcademies */}
        <div className="w-[300px] bottom-4 flex-col flex gap-2 items-center fixed left-4 top-[120px]">
          {/* Diğer akademilerim */}
          <span>Diğer Akademilerim</span>
          <div className="w-full h-[300px] border rounded-md"></div>
          <span>Başarılı Öğrenciler</span>
          <div className="w-full h-[300px] border rounded-md"></div>
        </div>
        {/* PostArea */}
        <div className=" flex-[3] gap-5 flex flex-col  items-center  ml-[500px] mr-[200px] right-10 relative ">
          {/* SinglePost */}
          <div className="w-3/4 h-[400px] bg-secondary relative rounded-md">
            <Image
              src={"/deneme.jpg"}
              alt="AcademyPic"
              fill
              className="object-cover rounded-md"
            />
          </div>
        </div>

        {/* ChatArea */}
        <div className="flex-[1]  ">
          <GlobalChat
            virtualAcademyData={{ id, academyName, members, imageFileUrl }}
          />
        </div>
      </div>
    </div>
  );
};

export default AcademyDashboard;
