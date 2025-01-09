"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import img1 from "@/public/CanliDers.png";
import img2 from "@/public/image1.png";
import img3 from "@/public/image2.png";
import img4 from "@/public/image4.png";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
const images = [img1, img2, img3, img4];

const LastSection = () => {
  const [activeImage, setActiveImage] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length); // Modulo ile döngü
    }, 4000);

    return () => clearInterval(interval); // Temizleme
  }, []);

  return (
    <div className="mt-[80px] mb-[60px] p-4 flex flex-row w-full gap-8 max-lg:flex-col-reverse">
      {/* Left Area */}
      <div className="flex flex-col  items-center justify-between">
        {/* Top */}
        <div className="flex-[1] flex flex-col items-center">
          <p className="sm:text-2xl text-base leading-none text-black">
            Sanal Akademi Platformu
          </p>
          <h2 className="font-bold sm:text-[226px] text-[150px] max-sm:text-[100px] leading-none text-black">
            VACA
          </h2>
          <p className=" leading-none w-fit sm:text-2xl p-2 bg-black text-secondary max-lg:mb-8">
            Senin Akademin , Senin Kuralların
          </p>
        </div>
        {/* ButtomButton */}
        <div className="flex gap-4 ">
          <Button className="bg-[#0F58B7] w-full" asChild>
            <Link href={"/create-academy"}>Akademini oluştur</Link>
          </Button>
          <Button className=" w-full" variant={"ghost"} asChild>
            <Link href={"/find-academy"}>Akademileri Keşfet</Link>
          </Button>
        </div>
      </div>
      {/* RightSliderArea */}
      <div className=" flex-[1] h-[500px] flex items-center flex-col gap-8  ">
        {/* Image Area */}
        <div className="w-3/4 h-[300px] sm:h-[400px] md:h-[500px] relative border p-2 ">
          <Image
            src={images[activeImage]}
            fill
            alt="deneme"
            className="object-cover"
          />
        </div>
        {/* Circle Area */}
        <div className="flex gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-4 h-4 rounded-full  cursor-pointer",
                activeImage === index ? "bg-blue-400" : "bg-muted-foreground"
              )}
              onClick={() => setActiveImage(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LastSection;
