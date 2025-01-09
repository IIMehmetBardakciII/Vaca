import { LucideIcon } from "lucide-react";

type BriefCardType = {
  icon: LucideIcon; // React bileşeni tipinde (örneğin: Lucide ikonları)
  title: string;
  description: string;
};

const BriefCard = ({
  icon: IconComponent,
  title,
  description,
}: BriefCardType) => {
  return (
    <div className="xl:w-[450px] w-[300px]  xl:h-[200px]  bg-[#0F58B7] relative flex flex-col items-center   rounded-[5px] sm:mt-[60px]  ">
      {/* İcon */}
      <div className="bg-white lg:p-4 w-fit  rounded-full h-fit relative lg:-top-4 ">
        <IconComponent size={58} className="text-[#0F58B7]" />
        {/* İkon boyutunu ayarlamak için size prop'u iletiliyor */}
      </div>
      <h3 className="text-secondary lg:text-[24px] font-bold">{title}</h3>
      <p className="text-secondary text-[14px] text-gray-300 text-center ">
        {description}
      </p>
    </div>
  );
};

export default BriefCard;
