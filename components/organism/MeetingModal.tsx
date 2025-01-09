"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import useUser from "@/lib/hooks/useUser";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { updateVirtualAcademyDocForVirtualClass } from "@/lib/actions/updateVirtualAcademyForVirtualClass";
import GeneralModal from "./GeneralModal";
import { PencilRuler } from "lucide-react";

type MeetingModalProps = {
  open: boolean;
  onClose: () => void;
  academyId: string;
};
const MeetingModal = ({ open, onClose, academyId }: MeetingModalProps) => {
  const router = useRouter();
  //* Sanal Sınıf oluşturma yeri
  const client = useStreamVideoClient();
  const { status } = useUser();
  const dateTime = new Date();
  const { toast } = useToast();
  const [topic, setTopic] = useState<string>();

  const createMeeting = async () => {
    if (!client || !status) return console.log("XXx");

    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create call");

      const startsAt =
        dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = topic || "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description: description,
          },
        },
      });

      router.push(`/virtual-academy/${academyId}/meeting/${call.id}`);
      toast({
        title: "Sanal Sınıf Başarıyla oluştu.",
      });
      // VirtualAcademyUpdate
      await updateVirtualAcademyDocForVirtualClass(
        academyId,
        call.id,
        description
      );
    } catch (error) {
      console.error(error);
      toast({
        title: "Sınıf oluştururken hata oluştu.",
      });
    }
  };
  return (
    <GeneralModal open={open} onClose={onClose}>
      <div className="flex flex-col gap-2">
        <h3 className="scroll-m-20 text-2xl flex items-center gap-2 font-semibold tracking-tight">
          Dersi Oluştur <PencilRuler size={20} />
        </h3>
        <Input
          placeholder="Dersin Konusunu Giriniz..."
          className="focus-visible:outline-none focus-visible:ring-0"
          onChange={(e) => setTopic(e.target.value)}
          value={topic}
        />
        <div className="flex justify-end">
          <Button onClick={createMeeting} className="bg-blue-500  ">
            Dersi Oluştur
          </Button>
        </div>
      </div>
    </GeneralModal>
  );
};

export default MeetingModal;
