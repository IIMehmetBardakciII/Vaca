import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="md:flex w-full bg-[#0F58B7] mt-[10px] sm:min-h-[650px] relative mb-[60px] rounded-md ">
      {/* Left zone */}
      <div className="w-full h-full absolute  opacity-[0.06]  mix-blend-overlay	">
        <Image src="/grid.jpg" alt="grid" fill className="object-cover" />
      </div>
      <div className="md:flex-[2]   max-lg:flex max-lg:flex-col max-lg:items-center p-8 ml-4 relative lg:z-[50]">
        <h1 className="font-black text-[96px] text-white leading-[96px] max-sm:leading-[48px] max-sm:text-[48px]  ">
          Eğitimi
        </h1>
        <h1 className="font-black text-[96px] text-white leading-[96px] max-sm:text-[48px] max-sm:leading-[48px]">
          Dijitalleştir
        </h1>
        <p className="text-secondary text-[20px] tracking-[2px] sm:mt-[42px] mt-5 max-sm:text-xs max-sm:leading-[16px]">
          Sanal Akademi ile Her Yerde, Herkes İçin Sınırsız Öğrenme ve Öğretim
          Fırsatı!
        </p>
        {/* Image Area */}
        <div className="sm:w-[500px] w-[300px] h-[292px] relative  sm:mt-6 ">
          <Image
            src="/CanliDers.png"
            alt="canliders"
            fill
            className="object-contain p-2"
          />
        </div>
        {/* ButtonArea */}
        <div className="flex gap-4">
          <Button
            asChild
            className="flex  px-[40px] py-[20px] bg-white text-primary  hover:bg-gray-100 cursor-pointer rounded-[4px]  items-center justify-center tracking-[1.6px] font-medium"
          >
            <Link href="/signup">HEMEN BAŞLAYIN</Link>
          </Button>
        </div>
      </div>
      {/* Right zone */}
      <div className="flex-[2] hidden    lg:flex justify-between items-end  relative overflow-hidden  ">
        {/* BigImage */}
        <div className="max-[1330px]:h-full max-[1330px]:w-full max-[1330px]:-bottom-[100px] w-5/6     h-[640px] relative   z-40 ">
          <Image
            src="/FemaleStudent.png"
            alt="femaleStudent"
            fill
            className="object-contain"
          />
        </div>
        <div className="w-3/4 h-[400px] z-10 max-xl:hidden  absolute bottom-0 -right-[80px]   ">
          <Image
            src="/MaleStudent.png"
            alt="malestudent"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
