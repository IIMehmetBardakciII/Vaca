import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

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
  // Zaman formatlama fonksiyonu
  const formatTime = (time: Timestamp | Date | string) => {
    let date;

    // Timestamp kontrolü
    if (time instanceof Timestamp) {
      date = time.toDate();
    } else if (typeof time === "string") {
      date = new Date(time);
    } else {
      date = time;
    }

    return date.toLocaleString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <Link
      href={`/virtual-academy/${academyId}/meeting/${callId}`}
      className="w-full h-[400px]  relative rounded-md cursor-pointer"
    >
      <div className="h-[300px] w-full relative border overflow-hidden ">
        <Image
          src={"/deneme.jpg"}
          alt="classImage"
          fill
          className="object-cover hover:scale-105 transition-all ease-in-out duration-150"
        />
      </div>
      <div>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {description ? description : "Dersin Konusu"}
        </h4>
        <small className="text-sm font-medium leading-none">
          {time
            ? `Başlangıç Tarihi: ${formatTime(time)}`
            : "Başlangıç Tarihi Bilinmiyor"}
        </small>
      </div>
    </Link>
  );
};

export default VirtualClassCard;
