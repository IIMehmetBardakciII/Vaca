import { Briefcase, Puzzle, School } from "lucide-react";
import BriefCard from "./BriefCard";

const BriefSection1 = () => {
  return (
    <section className="mt-[60px] w-full mb-[60px] p-4 flex flex-col items-center justify-center">
      <h2 className="flex justify-center font-bold sm:text-[64px] text-[44px] max-sm:mb-2  ">
        Eğitim Engel Tanımaz
      </h2>
      <div className="flex w-full max-sm:items-center  lg:justify-around gap-2 max-sm:flex-col">
        <BriefCard
          icon={School} // Bileşeni direkt olarak iletiyoruz
          title={"Akademini Kur"}
          description={"Sanal akademiler kurarak eğitiminizi paylaşın."}
        />
        <BriefCard
          icon={Briefcase} // Bileşeni direkt olarak iletiyoruz
          title="Akademilere Katıl"
          description={
            "Akademilere katılarak çeşitliliği artırın ve yeni beceriler kazanın."
          }
        />
        <BriefCard
          icon={Puzzle} // Bileşeni direkt olarak iletiyoruz
          title={"Etkileşimli Öğrenme"}
          description="Canlı dersler, planlı etkinlikler, sohbetler ve sosyal duyurular gibi özelliklerle öğrenimi destekleyin."
        />
      </div>
    </section>
  );
};

export default BriefSection1;
