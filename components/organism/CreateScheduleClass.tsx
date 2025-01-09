"use client";
import { AlarmClock, BadgeCheck, Copy } from "lucide-react";
import { Button } from "../ui/button";
import GeneralModal from "./GeneralModal";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { toast } from "@/hooks/use-toast";
import { updateVirtualAcademyDocForVirtualClass } from "@/lib/actions/updateVirtualAcademyForVirtualClass";
import useUser from "@/lib/hooks/useUser";
import router from "next/router";
// import { tr } from "date-fns/locale"; // Türkçe dili

interface ScheduleValues {
  dateTime: Date;
  description: string;
}

const initialValues: ScheduleValues = {
  dateTime: new Date(),
  description: "",
};

type CreateScheduleClassType = {
  academyId: string;
};
const CreateScheduleClass = ({ academyId }: CreateScheduleClassType) => {
  const [copyLink, setCopyLink] = useState<boolean>(false);
  const [link, setOpenLink] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [values, setValues] = useState<ScheduleValues>(initialValues);
  const client = useStreamVideoClient();
  const { status } = useUser();
  const [callDetails, setCallDetails] = useState<Call>();

  const createMeeting = async () => {
    if (!client || !status) return console.log("XXx");

    try {
      if (!values.dateTime) {
        toast({ title: "Please select a date and time" });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create call");

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Schedule meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description: description,
          },
        },
      });
      setOpen(false);
      setCallDetails(call);
      setOpenLink(true);
      toast({
        title: "Sanal Sınıf Başarıyla oluştu.",
      });
      // VirtualAcademyUpdate
      await updateVirtualAcademyDocForVirtualClass(
        academyId,
        call.id,
        description,
        startsAt
      );
    } catch (error) {
      console.error(error);
      toast({
        title: "Sınıf oluştururken hata oluştu.",
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_DOMAIN}/virtual-academy/${academyId}/meeting/${callDetails?.id}`;
  return (
    <>
      <Button
        asChild
        className="justify-start hover:bg-green-400"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-2 cursor-pointer">
          <AlarmClock size={16} />
          <span>Planlı Ders Oluştur</span>
        </div>
      </Button>
      <GeneralModal
        open={open}
        onClose={() => setOpen(false)}
        className="relative "
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl flex items-center gap-2 font-semibold">
            Planlı Dersi Oluştur <AlarmClock size={20} />
          </h3>

          {/* Açıklama Alanı */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Ders Hakkında Açıklama Giriniz
            </label>
            <Textarea
              className="resize-none border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>

          {/* Tarih ve Zaman Seçici */}
          <div className="w-full relative">
            <label className="block text-sm font-medium mb-1">
              Zaman ve Tarih Seçiniz
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Saat"
              dateFormat={"MMMM d, yyyy h:mm aa"}
              className="border  border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              popperPlacement="bottom-end" // Takvimin üst tarafa hizalanmasını sağlar
            />
          </div>

          {/* Oluştur Butonu */}
          <div className="flex justify-end">
            <Button
              onClick={createMeeting}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Dersi Oluştur
            </Button>
          </div>
        </div>
      </GeneralModal>

      <GeneralModal
        open={link}
        onClose={() => setOpenLink(false)}
        className="bg-blue-500  "
      >
        <h2 className="scroll-m-20 border-b mb-2 border-primary text-3xl pb-1 font-semibold tracking-tight first:mt-0 ">
          Planlı Sanal Sınıf Oluşturuldu
        </h2>
        <div className="flex items-center gap-2 text-secondary bg-blue-600 p-2 rounded-md justify-center text-sm font-medium cursor-pointer">
          {!copyLink ? (
            <div
              className="flex items-center gap-2"
              onClick={() => {
                navigator.clipboard.writeText(meetingLink);
                setCopyLink(true);
              }}
            >
              {/* Linki Kopyala Öğrencilerinle paylaş. <Copy size={16} */}
              Linki Kopyala Öğrencilerinle Paylaş. <Copy size={16} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Link Kopyalandı. <BadgeCheck size={16} />
            </div>
          )}
        </div>
      </GeneralModal>
    </>
  );
};

export default CreateScheduleClass;
