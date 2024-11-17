import { getAllAcademyData } from "@/lib/actions/getVirtualAcademyData";
import AcademyCard from "./_components/AcademyCard";

const FindAcademyPage = async () => {
  const getAllAcademy = await getAllAcademyData();

  return (
    <div>
      <div className="flex w-full items-center  flex-col gap-2 ">
        {getAllAcademy.map((academyData, index) => {
          //* İki Kere yapılan map işleminin önüne geçmek tekrarı engellemek role yazısında

          return <AcademyCard key={index} academyData={academyData} />;
        })}
      </div>
    </div>
  );
};

export default FindAcademyPage;
