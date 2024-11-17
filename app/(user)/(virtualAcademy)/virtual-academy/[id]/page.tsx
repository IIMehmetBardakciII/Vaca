import CreateClass from "@/components/organism/CreateClass";
import { Button } from "@/components/ui/button";
import { getRole } from "@/lib/actions/AcademyRole";
import { getVirtualAcademyData } from "@/lib/actions/getVirtualAcademyData";
import { Bell, CircleX, Merge, MessageCircleMore } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

  return (
    <div className="flex mt-2">
      {/* Sidebar */}
      <div className="border-r rounded-md w-fit  h-[calc(100%-40px)] fixed overflow-hidden bg-secondary gap-4 justify-between p-4 max-w-[200px] flex flex-col ">
        <div className="flex flex-col gap-4">
          <div>
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
              {virtualAcademyData.academyAbout}
            </p>
            <small className="text-sm font-medium leading-none cursor-pointer flex gap-1 mt-2">
              Üye Sayısı:{" "}
              <span className="text-muted-foreground">
                {virtualAcademyData.members?.length}/
                {virtualAcademyData.numberOfStudents}
              </span>
            </small>
          </div>

          {role === "Rektor" && (
            <Button asChild className="justify-start bg-blue-600">
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
              Duyurular
            </Link>
          </Button>
          <Button asChild className="justify-start">
            <Link href="#" className="flex gap-2">
              <MessageCircleMore size={16} />
              <span>Chat</span>
            </Link>
          </Button>
        </div>
        <Button asChild variant={"destructive"} className="justify-start">
          <Link href="#" className="flex items-center gap-2 mb-2">
            <CircleX size={16} />
            <span>Akademiden Ayrıl</span>
          </Link>
        </Button>
      </div>
      {/* For Post & Chat Area */}
      <div className="flex flex-1 ml-[200px] ">
        {/* PostArea */}
        <div className=" w-3/4 gap-5 flex flex-col  items-center p-2">
          {/* SinglePost */}
          <div className="w-2/4 h-[400px] bg-secondary relative rounded-md">
            <Image
              src={"/deneme.jpg"}
              alt="AcademyPic"
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="w-2/4 h-[400px] bg-secondary relative rounded-md">
            <Image
              src={"/deneme.jpg"}
              alt="AcademyPic"
              fill
              className="object-cover rounded-md"
            />
          </div>
        </div>

        {/* ChatArea */}
        <div className="w-1/4 bg-slate-200 rounded-md p-2 h-[600px]">
          Chat Alanı
        </div>
      </div>
    </div>
  );
};

export default AcademyDashboard;
