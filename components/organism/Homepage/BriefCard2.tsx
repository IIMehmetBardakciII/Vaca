import Image from "next/image";

type BriefCard2Type = {
  image: string;
  title: string;
  description: string;
};
const BriefCard2 = ({ image, title, description }: BriefCard2Type) => {
  return (
    <div className="  w-full xl:h-[450px] bg-secondary rounded-[5px] flex gap-5 flex-col  p-2 mt-4">
      {/* Image */}
      <div className="w-3/4 h-[230px] mx-auto bg-primary flex items-center justify-center rounded-[5px]">
        <div className="relative w-full h-full scale-75">
          <Image
            src={image}
            alt="image"
            fill
            className="object-cover    rounded-[10px]"
          />
        </div>
      </div>
      <div className="ml-4 flex flex-col gap-4">
        <h4 className="font-bold  text-2xl">{title}</h4>
        <p className="text-[14px] leading-[22px] text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BriefCard2;
