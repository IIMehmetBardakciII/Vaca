"use client";
import { Button } from "@/components/ui/button";
import { CircleX, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import GeneralModal from "../GeneralModal";
import { leaveTheAcademy } from "@/lib/actions/LeaveTheAcademy";
import { useToast } from "@/hooks/use-toast";

type UserDeleteButtonType = {
  academyId: string;
  userId: string;
};
const UserDeleteButton = ({ academyId, userId }: UserDeleteButtonType) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  async function handleDeleteUser() {
    setLoading(true);
    try {
      await leaveTheAcademy(academyId, userId);
      toast({
        title: "Kullanıcı başarıyla silindi. Sayfayı yenileyin.",
      });
      setOpen(false);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Kullanıcı rolü atanırken hata oluştu..",
      });
      setLoading(false);
      console.error(
        "Kullanıcı silinirken hata oluştu. bu hata userDeleteButton.tsx den gleiyor.",
        error
      );
    }
  }
  return (
    <div>
      <Button
        //   onClick={(e) => {
        //     e.preventDefault();
        //     setOpenModal(true);
        //   }}
        onClick={() => setOpen(true)}
        asChild
        className=" justify-start  w-full bg-red-400 "
      >
        <Link
          href="#"
          className=" justify-start   items-center gap-2 hover:bg-red-500 "
        >
          <CircleX size={16} />
          <span>Akademiden At</span>
        </Link>
      </Button>

      {/* Modal */}
      <GeneralModal open={open} onClose={() => setOpen(false)}>
        <p className="text-base font-semibold text-red-400">
          Kullanıcıyı atmak istediğine emin misin?
        </p>
        <div className="w-full flex items-end justify-end px-3">
          <Button
            onClick={handleDeleteUser}
            className="flex items-end mt-4 hover:text-secondary hover:bg-red-400"
            variant={"ghost"}
          >
            Kullanıcıyı At
          </Button>
          {loading && <LoaderCircle className="animate-spin" />}
        </div>
      </GeneralModal>
    </div>
  );
};

export default UserDeleteButton;
