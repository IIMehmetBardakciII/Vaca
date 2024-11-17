"use client";
import { joinRequest } from "@/lib/actions/joinRequestForVirtualAcademy";
import Image from "next/image";
import { useState } from "react";

const AcademyCard = ({ academyData }: any) => {
  const [requestStatus, setRequestStatus] = useState<boolean>(false);
  const handleJoinRequest = async () => {
    const response = await joinRequest(academyData.id);
    if (response.success) {
      setRequestStatus(true);
    }
  };
  return (
    <div
      className="w-1/2 border rounded cursor-pointer group hover:bg-primary transition-all ease-in-out flex justify-between p-3"
      onClick={handleJoinRequest}
    >
      <div className="flex justify-between w-full">
        <div className="flex gap-4 items-center ">
          {/* Academy Profile */}
          <div className="w-10 h-10 rounded-full bg-secondary relative">
            <Image src={academyData.imageFileUrl} alt="AcademyPic" fill />
          </div>
          {/* Academy Name */}
          {/* Academy Role */}
          <div className="flex flex-col gap-1">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight group-hover:text-secondary">
              {academyData.academyName}
            </h4>
            <small className="text-sm font-medium leading-none text-gray-500">
              Hakkında: <span>{academyData.academyAbout.slice(0, 50)}...</span>
            </small>
          </div>
        </div>
        {/* Katılma İsteği */}
        <div className="flex items-center">
          <small className="text-sm font-medium leading-none text-gray-500 hover:text-green-400">
            {requestStatus ? "İstek Gönderildi" : "Katılma İsteği Gönder"}
          </small>
        </div>
        {/* Öğrenci sayısı */}
        <div className="flex items-center">
          <small className="text-sm font-medium leading-none text-gray-500">
            Öğrenci Sayısı: <span>{academyData.numberOfStudents}</span>
          </small>
        </div>
      </div>
    </div>
  );
};

export default AcademyCard;
