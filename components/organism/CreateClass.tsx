"use client";
import { CirclePlus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import MeetingModal from "./MeetingModal";

type createClassType = {
  academyId: string;
};
const CreateClass = ({ academyId }: createClassType) => {
  const [modalState, setModalState] = useState<boolean>(false);
  // const { status, userData } = useUser();

  const onClose = () => setModalState(false);
  return (
    <>
      <Button
        asChild
        className="justify-start bg-lime-600"
        onClick={() => setModalState(true)}
      >
        <p className="flex gap-2 cursor-pointer">
          <CirclePlus size={16} />
          Ders Oluştur
        </p>
      </Button>

      {/* Modal Form */}
      <MeetingModal open={modalState} onClose={onClose} academyId={academyId} />
    </>
  );
};

export default CreateClass;
