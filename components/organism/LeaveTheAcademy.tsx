"use client";
import { CircleX } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { handleLeaveTheAcademy } from "@/lib/actions/LeaveTheAcademy";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

type LeaveTheAcademyType = {
  academyId: string;
  Role: string;
  userId: string;
};

const LeaveTheAcademy = ({ academyId, Role, userId }: LeaveTheAcademyType) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  async function handleOnClickDelete() {
    setLoading(true);
    const result = await handleLeaveTheAcademy(academyId, Role, userId);
    if (result) {
      router.push("/");
      toast({
        title: "Akademiden ayrılma işlemi başarıyla gerçekleştirildi.",
      });
      setOpenModal(false);
      setLoading(false);
    } else {
      toast({
        title: "Akademiden ayrılma işlemi sırasında bir sorun oluştu.",
      });
      setOpenModal(false);
      setLoading(true);
    }
  }
  return (
    <div>
      <Button
        onClick={(e) => {
          e.preventDefault();
          setOpenModal(true);
        }}
        asChild
        className=" justify-start  w-full "
      >
        <Link
          href="#"
          className=" justify-start   items-center gap-2 hover:bg-red-500 "
        >
          <CircleX size={16} />
          <span>Akademiden Ayrıl</span>
        </Link>
      </Button>

      {openModal && (
        <Dialog open={openModal} onOpenChange={() => setOpenModal(false)}>
          <DialogContent className="absolute  bg-black/25 z-[50]   bottom-4 rounded-md  flex flex-col items-center justify-center">
            <div className="bg-secondary p-4 flex items-center flex-col justify-center gap-2 rounded-md">
              <DialogTitle>
                {Role === "Rektor" ? (
                  <p>
                    Akademiyi kapatmak istediğine emin misin?
                    <span className="text-red-500">
                      Dikkat Et senle beraber tüm üyelerin akademiden silinecek.
                    </span>
                  </p>
                ) : (
                  "Akademiden Ayrılmak istediğine emin misin?"
                )}
              </DialogTitle>
              <div>
                <Button
                  className="bg-red-500 relative mr-2"
                  onClick={handleOnClickDelete}
                >
                  Evet
                </Button>
                <Button onClick={() => setOpenModal(false)}>İptal et</Button>
              </div>

              {loading && <LoaderCircle size={16} className="animate-spin" />}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LeaveTheAcademy;
