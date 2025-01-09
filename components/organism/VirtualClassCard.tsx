"use client";
import { cn } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { BadgeCheck, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";

type VirtualClassCard = {
  callId?: string;
  description?: string;
  time?: Timestamp | Date;
  academyId?: string;
};

const VirtualClassCard = ({
  callId,
  description,
  time,
  academyId,
}: VirtualClassCard) => {
  const [copyLink, setCopyLink] = useState<boolean>(false);
  const meetingLink = `${process.env.NEXT_PUBLIC_DOMAIN}/virtual-academy/${academyId}/meeting/${callId}`;

  // Zaman formatlama fonksiyonu
  const formatTime = (time: Timestamp | Date | string) => {
    let date;

    if (time instanceof Timestamp) {
      date = time.toDate();
    } else if (time instanceof Date) {
      date = time;
    } else if (typeof time === "string") {
      date = new Date(time);
    }

    return date?.toLocaleString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Şu anki zamanı al
  const [currentTime, setCurrentTime] = useState(new Date());

  // time bir Timestamp ise, .toDate() ile Date'e dönüştürüp, zaman karşılaştırması yapıyoruz
  const isFutureClass =
    time instanceof Timestamp
      ? time.toDate().getTime() > currentTime.getTime()
      : time instanceof Date
      ? time.getTime() > currentTime.getTime()
      : false;

  // Update currentTime every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date()); // Update current time every minute
    }, 60000); // Update every minute (60000 ms)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Update remaining time every minute
  useEffect(() => {
    if (time) {
      setRemainingTime(calculateRemainingTime(time));
    }
  }, [currentTime, time]);
  // Gelecekteki derse kalan süreyi hesapla
  const calculateRemainingTime = (time: Timestamp | Date) => {
    const targetTime = time instanceof Timestamp ? time.toDate() : time;
    const timeDifference = targetTime.getTime() - currentTime.getTime();

    if (timeDifference <= 0) return "Geçmiş";

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${hours} saat ${minutes} dakika`;
  };
  // State to store remaining time
  const [remainingTime, setRemainingTime] = useState<string>(
    time ? calculateRemainingTime(time) : "Geçmiş"
  );
  return (
    <div
      className={`sm:w-full h-fit  bg-secondary px-4 py-2 relative rounded-md cursor-pointer`}
    >
      <div>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {description ? description : "Dersin Konusu"}
        </h4>
        <small className="text-sm font-medium leading-none">
          {time
            ? `Başlangıç Tarihi: ${formatTime(time)}`
            : "Başlangıç Tarihi Bilinmiyor"}
        </small>
        {isFutureClass && (
          <div className=" bg-primary rounded-md border left-0 backdrop-black/60 w-full h-fit flex items-center justify-center text-white font-bold">
            <div className="text-center">
              <p className="md:text-lg sm:mb-2 text-xs">
                Bu derse şu an katılamazsınız.
              </p>
              <p className="md:text-lg sm:mb-2 text-xs text-green-400">
                Kalan süre: {remainingTime}
              </p>
            </div>
          </div>
        )}
        <div className="flex gap-2 mt-2 lg:items-center flex-row max-lg:flex-col">
          {/* Join Button */}
          <Button
            asChild
            className="max-md:text-xs max-md:px-2 max-md:py-0.5 max-md:w-fit"
          >
            <Link
              href={`/virtual-academy/${academyId}/meeting/${callId}`}
              className={cn(
                "relative",
                isFutureClass ? "pointer-events-none" : ""
              )}
              passHref
            >
              Derse Katıl
            </Link>
          </Button>
          <div>
            {!copyLink ? (
              <Button
                asChild
                className="justify-start hover:bg-blue-600 hover:text-secondary flex items-center gap-2   max-md:text-xs max-md:px-2 max-md:py-0.5 max-md:w-fit"
                onClick={() => {
                  navigator.clipboard.writeText(meetingLink);
                  setCopyLink(true);
                }}
                variant={"link"}
              >
                <div>
                  <Copy size={16} />
                  Linki Paylaş.
                </div>
              </Button>
            ) : (
              <Button
                asChild
                className="justify-start hover:bg-blue-600 flex items-center gap-2 max-md:text-xs max-md:px-2 max-md:py-0.5 max-md:w-fit "
                onClick={() => {
                  navigator.clipboard.writeText(meetingLink);
                  setCopyLink(true);
                }}
              >
                <div>
                  <BadgeCheck size={16} />
                  Link Kopyalandı.
                </div>
              </Button>
            )}
          </div>
          <small
            className={cn(
              "text-xs  leading-none",
              isFutureClass ? "text-slate-400" : "text-green-400"
            )}
          >
            {isFutureClass ? "Planlı Ders" : "Aktif Ders"}
          </small>
        </div>
      </div>
      {/* Eğer sınıf gelecekte ise, kullanıcıya uyarı göster */}
    </div>
  );
};

export default VirtualClassCard;
