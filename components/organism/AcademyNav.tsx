"use client";

import { Button } from "@/components/ui/button";
import {
  AlarmClock,
  Bell,
  BookOpen,
  ChartSpline,
  CircleArrowOutUpRight,
  Merge,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CreateClass from "./CreateClass";
import useUser from "@/lib/hooks/useUser";
import { useEffect, useState } from "react";
import { getUserData } from "@/lib/actions/UserData";
import { getVirtualAcademyData } from "@/lib/actions/getVirtualAcademyData";
import LeaveTheAcademy from "./LeaveTheAcademy";
import CreateScheduleClass from "./CreateScheduleClass";

interface AcademyNavProps {
  role: string;
  virtualAcademyData: {
    id: string;
    academyName?: string;
    members: any[];
    numberOfStudents: string;
    joinRequests: any[];
    imageFileUrl?: string;
  };
}

const AcademyNav = ({
  role,
  virtualAcademyData: {
    id,
    academyName,
    members,
    imageFileUrl,
    numberOfStudents,
    joinRequests,
  },
}: AcademyNavProps) => {
  const { userData } = useUser();
  const [userAcademies, setUserAcademies] = useState<any[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // State for dropdown visibility

  useEffect(() => {
    const getUserAcademies = async () => {
      try {
        if (userData?.email) {
          const wholeAcademies = await getUserData(userData?.email); // Kullanıcı verilerini al
          // virtualAcademies dizisindeki her bir öğeden virtualAcademyId'yi al
          const academyIds = wholeAcademies.virtualAcademies.map(
            (academy: { virtualAcademyId: string }) => academy.virtualAcademyId
          );

          // Akademi verilerini almak için `getVirtualAcademyData` fonksiyonunu çağır
          const academyDataPromises = academyIds.map((academyId: string) =>
            getVirtualAcademyData(academyId)
          );

          // Tüm akademi verilerini aynı anda al
          const academyData = await Promise.all(academyDataPromises);
          // Yalnızca gerekli verileri al (id, academyName, imageFileUrl)
          const filteredAcademyData = academyData.map((academy: any) => ({
            id: academy.id,
            academyName: academy.academyName,
            imageFileUrl: academy.imageFileUrl,
          }));
          setUserAcademies([filteredAcademyData]);
        }
      } catch (error) {
        console.error("User academies data fetch error:", error);
      }
    };

    if (userData?.email) {
      getUserAcademies(); // UseEffect her değişiklikte çalıştırılır
    }
  }, [userData?.email]); // userData email değiştiğinde yeniden çalıştırılır
  return (
    <div className="w-fit border p-4 flex justify-center h-[calc(100%-100px)]  bottom-4 bg-gray-50 fixed    rounded-md gap-4">
      <div
        className={` w-fit flex flex-col gap-4   transition-all duration-300}`}
      >
        {/* AcademyData */}
        <div className="flex flex-col items-center gap-2">
          {imageFileUrl && (
            <div className="w-24 h-24 rounded-full relative ">
              <Image
                src={imageFileUrl}
                alt={`${academyName} Image`}
                fill
                className="object-cover rounded-full "
              />
            </div>
          )}
          <div className="flex items-center gap-4 ">
            <span className="text-sm font-medium leading-none cursor-pointer">
              {academyName} Akademi
            </span>
            <small className="text-sm font-medium leading-none cursor-pointer flex gap-1 ">
              Üye Sayısı:{" "}
              <span className="text-muted-foreground">
                {members?.length}/{numberOfStudents}
              </span>
            </small>
          </div>
        </div>
        <div className="flex flex-col justify-between h-full w-full">
          <div className="flex flex-col  gap-2">
            {role === "Rektor" && (
              <div className="flex flex-col  gap-2">
                <Button asChild className="justify-start hover:bg-blue-600 ">
                  <Link
                    href={`/virtual-academy/${id}/requestForJoin`}
                    className="flex gap-2"
                  >
                    <Bell size={16} />
                    Katılma İsteği ({joinRequests.length})
                  </Link>
                </Button>
                <Button asChild className="justify-start hover:bg-blue-600">
                  <Link
                    href={`/virtual-academy/${id}/getAllUsers`}
                    className="flex gap-2"
                  >
                    <Users size={16} />
                    Tüm Üyeleri Gör
                  </Link>
                </Button>
              </div>
            )}
            {(role === "Rektor" || role === "Educator") && (
              <div className="flex flex-col gap-2">
                <CreateClass academyId={id} />
                <CreateScheduleClass academyId={id} />
              </div>
            )}

            <Button asChild className="justify-start">
              <Link
                href={`/virtual-academy/${id}/virtualClasses`}
                className="flex gap-2 bg-orange-600"
              >
                <Merge size={16} />
                Derslere Katıl
              </Link>
            </Button>
            <Button asChild className="justify-start">
              <Link href={`/virtual-academy/${id}`} className="flex gap-2">
                <Bell size={16} />
                Duyurular
              </Link>
            </Button>
            <Button asChild className="justify-start">
              <Link
                href={`/virtual-academy/${id}/discussion`}
                className="flex gap-2"
              >
                <CircleArrowOutUpRight size={16} />
                Gönderi Paylaş
              </Link>
            </Button>

            <Button asChild className="justify-start">
              <Link
                href="#"
                className="flex items-center gap-2 hover:bg-red-500"
                onMouseEnter={() => setIsDropdownVisible(true)}
                // onMouseLeave={() => setIsDropdownVisible(false)}
              >
                <BookOpen size={16} />
                <span>Diğer Akademiler</span>
              </Link>
            </Button>
          </div>
          {/* Leave the academy */}
          <LeaveTheAcademy
            academyId={id}
            Role={role}
            userId={userData?.email as string}
          />
        </div>
        {isDropdownVisible && (
          <div
            className="absolute flex bg-gray-50 border p-4 w-fit  h-[200px] right-0 top-[400px] left-[250px] overflow-scroll  flex-col gap-2"
            onMouseLeave={() => setIsDropdownVisible(false)}
          >
            {userAcademies[0]?.map((academy: any) => (
              <Link
                href={`/virtual-academy/${academy.id}`}
                key={academy.id}
                className="flex items-center gap-2 bg-gray-200/30 px-2 py-1 hover:bg-primary transition-colors ease-in  rounded-[5px]"
              >
                <div className="w-8 h-8 relative">
                  <Image
                    src={academy.imageFileUrl}
                    alt="academyPP"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>

                <span className="text-base  text-muted-foreground">
                  {academy.academyName}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademyNav;
