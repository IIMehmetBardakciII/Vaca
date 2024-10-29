import { Button } from "@/components/ui/button";
import { getVirtualAcademyData } from "@/lib/actions/getVirtualAcademyData";
import { Bell, CircleX, MessageCircleMore } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AcademyDashboard = async ({ params }: { params: { id: string } }) => {
  const virtualAcademyData = await getVirtualAcademyData(params.id);
  if (!virtualAcademyData) {
    return <div>Academy Bulunamadı</div>;
  }
  return (
    <div className=" border-r w-fit mt-2 h-[calc(100%-40px)] fixed overflow-hidden bg-secondary gap-4 justify-between p-4 max-w-[200px] flex  flex-col   ">
      <div className="flex flex-col gap-4">
        <div>
          {/* imageFileUrl var mı kontrol ediyoruz */}
          {virtualAcademyData.imageFileUrl && (
            <div className="w-8 h-8 rounded-full relative">
              <Image
                src={virtualAcademyData.imageFileUrl}
                alt={`${virtualAcademyData.academyName} Image`}
                fill
                className="object-cover"
              />
            </div>
          )}
          <small className="text-sm font-medium leading-none cursor-pointer">
            {virtualAcademyData.academyName}
          </small>
          <p className="text-xs text-muted-foreground">
            Hakkımızda:
            {virtualAcademyData.academyAbout?.charAt(0).toUpperCase()}
            {virtualAcademyData.academyAbout?.slice(
              1,
              virtualAcademyData.academyAbout.length
            )}
          </p>
          <small className="text-sm font-medium leading-none cursor-pointer flex gap-1 mt-2">
            Üye Sayısı:{" "}
            <span className="text-muted-foreground">
              {virtualAcademyData.numberOfStudents}
            </span>
          </small>
        </div>
        <Button asChild className="justify-start">
          <Link
            href={`/virtual-academy/${virtualAcademyData.id}/duyurular`}
            className="flex gap-2"
          >
            <Bell size={16} />
            Duyurular
          </Link>
        </Button>
        <Button asChild className="justify-start">
          <Link href={"#"} className="flex gap-2  ">
            <MessageCircleMore size={16} />
            <span>Chat</span>
          </Link>
        </Button>
      </div>
      <Button asChild variant={"destructive"} className="justify-start">
        <Link href={"#"} className="flex items-center  gap-2 mb-2">
          <CircleX size={16} />
          <span>Akademiden Ayrıl</span>
        </Link>
      </Button>
    </div>
  );
};

export default AcademyDashboard;
