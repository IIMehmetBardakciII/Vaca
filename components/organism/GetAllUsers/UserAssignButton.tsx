"use client";
import { Button } from "@/components/ui/button";
import { ArrowsUpFromLine, LoaderCircle } from "lucide-react";
import Link from "next/link";
import GeneralModal from "../GeneralModal";
import { useState } from "react";
import RadioComponent, { RadioGroup } from "../RadioComponent";
import { assignTheUser } from "@/lib/actions/AssignTheUser";
import { useToast } from "@/hooks/use-toast";

type UserAssignButtonType = {
  userId: string;
  role: string;
  userName: string;
  academyId: string;
};
const UserAssignButton = ({
  userId,
  role,
  userName,
  academyId,
}: UserAssignButtonType) => {
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const [rol, setRol] = useState(role);
  const [loading, setLoading] = useState<boolean>(false);
  async function handleAssignButton() {
    setLoading(true);
    try {
      await assignTheUser({
        userId: userId,
        role: rol,
        academyId: academyId,
      });
      toast({
        title: "Kullanıcı rolü başarılı bir şekilde atandı.",
      });
      setOpen(false);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Kullanıcı rolü atanırken hata oluştu..",
      });
      setLoading(false);
      console.error(
        "Kullanıcı rolü güncellenirken hata oluştu. bu hata userAssignButton.tsx den gleiyor.",
        error
      );
    }
  }
  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        asChild
        className=" justify-start  w-full bg-green-400 "
      >
        <Link
          href="#"
          className=" justify-start   items-center gap-2 hover:bg-green-500"
        >
          <ArrowsUpFromLine size={16} />
          <span>Kullanıcıyı Ata</span>
        </Link>
      </Button>
      <GeneralModal
        open={open}
        onClose={() => {
          setOpen(false);
          setRol(role);
        }}
      >
        <h2 className="text-xl font-semibold mb-4">Kullanıcı Atama</h2>
        <div className="flex flex-col gap-2 mb-2">
          <small className="text-sm font-medium leading-none">{`Kullanıcı Maili: ${userId}`}</small>
          <small className="text-sm font-medium leading-none">{`Kullanıcı Adı: ${userName}`}</small>
          <small className="text-sm font-medium leading-none">{`Kullanıcı Rolü: ${role}`}</small>
        </div>

        <RadioGroup value={rol} onChange={(e) => setRol(e.target.value)}>
          <div className="flex  gap-2">
            <RadioComponent value={"Rektor"} disabled={role === "Rektor"}>
              Rektor
            </RadioComponent>
            <RadioComponent value={"Educator"} disabled={role === "Educator"}>
              Educator
            </RadioComponent>
            <RadioComponent value={"Student"} disabled={role === "Student"}>
              Student
            </RadioComponent>
          </div>
        </RadioGroup>
        <div className="w-full flex items-end justify-end px-3">
          <Button className="flex items-end mt-4" onClick={handleAssignButton}>
            Rolü Ata
          </Button>
          {loading && <LoaderCircle className="animate-spin" />}
        </div>
      </GeneralModal>
    </div>
  );
};

export default UserAssignButton;
