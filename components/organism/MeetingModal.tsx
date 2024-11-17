"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import useUser from "@/lib/hooks/useUser";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useToast } from "@/hooks/use-toast";
import { updateVirtualAcademyDocForVirtualClass } from "@/lib/actions/updateVirtualAcademyForVirtualClass";

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Sanal Ders Oluşturma</DialogTitle>
        <Input
          placeholder="Dersin Konusunu Giriniz..."
          className="focus-visible:outline-none focus-visible:ring-0"
          onChange={(e) => setTopic(e.target.value)}
          value={topic}
        />
        <Button onClick={createMeeting} className="bg-blue-500">
          Dersi Oluştur
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
