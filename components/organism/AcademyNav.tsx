"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, CircleX, Merge } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CreateClass from "./CreateClass";

interface AcademyNavProps {
  role: string;
  virtualAcademyData: {
    id: string;
    academyName?: string | "Akademi Adı";
    members: any[];
    numberOfStudents: string; // Burada number yerine string olarak tanımlıyoruz
    joinRequests: any[];
    imageFileUrl?: string;
  };
}

const AcademyNav = ({ role, virtualAcademyData }: AcademyNavProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Kullanıcı kaydırma mesafesini kontrol ediyoruz.
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center sticky top-[60px] z-20 rounded-md gap-4">
      <div
        className={` w-fit flex flex-col gap-4   transition-all duration-300 ${
          isScrolled ? "bg-gray-50 shadow-lg p-4" : ""
        }`}
      >
        {/* AcademyData */}
        <div className="flex flex-col items-center gap-2">
          {virtualAcademyData.imageFileUrl && (
            <div className="w-24 h-24 rounded-full relative ">
              <Image
                src={virtualAcademyData.imageFileUrl}
                alt={`${virtualAcademyData.academyName} Image`}
                fill
                className="object-cover rounded-full "
              />
            </div>
          )}
          <div className="flex items-center gap-4 ">
            <span className="text-sm font-medium leading-none cursor-pointer">
              {virtualAcademyData.academyName} Akademi
            </span>
            <small className="text-sm font-medium leading-none cursor-pointer flex gap-1 ">
              Üye Sayısı:{" "}
              <span className="text-muted-foreground">
                {virtualAcademyData.members?.length}/
                {virtualAcademyData.numberOfStudents}
              </span>
            </small>
          </div>
        </div>
        <div className="flex gap-4">
          {role === "Rektor" && (
            <Button asChild className="justify-start hover:bg-blue-600">
              <Link
                href={`/virtual-academy/${virtualAcademyData.id}/requestForJoin`}
                className="flex gap-2"
              >
                <Bell size={16} />
                Katılma İsteği ({virtualAcademyData.joinRequests.length})
              </Link>
            </Button>
          )}
          {(role === "Rektor" || role === "Educator") && (
            <CreateClass academyId={virtualAcademyData.id} />
          )}

          <Button asChild className="justify-start">
            <Link
              href={`/virtual-academy/${virtualAcademyData.id}/virtualClasses`}
              className="flex gap-2 bg-orange-600"
            >
              <Merge size={16} />
              Derslere Katıl
            </Link>
          </Button>
          <Button asChild className="justify-start">
            <Link
              href={`/virtual-academy/${virtualAcademyData.id}/duyurular`}
              className="flex gap-2"
            >
              <Bell size={16} />
              Tartışma
            </Link>
          </Button>
          <Button asChild className="justify-start">
            <Link
              href="#"
              className="flex items-center gap-2 hover:bg-red-500 "
            >
              <CircleX size={16} />
              <span>Akademiden Ayrıl</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AcademyNav;
