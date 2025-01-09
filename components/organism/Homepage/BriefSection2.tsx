import Image from "next/image";
import BriefCard2 from "./BriefCard2";

const BriefSection2 = () => {
  return (
    <section className="flex w-full bg-[#0F58B7] flex-col p-4  sm:min-h-[650px] relative lg:mb-[60px] justify-center max-sm:items-center  mt-[80px] rounded-md ">
      {/* Left zone */}
      <div className="w-full h-full absolute  opacity-[0.06]  mix-blend-overlay	">
        <Image src="/grid.jpg" alt="grid" fill className="object-cover" />
      </div>
      <h2 className="flex justify-center font-bold sm:text-[64px] text-[44px] max-sm:mb-2 text-secondary  ">
        Neden Vaca
      </h2>
      <div className="grid max-sm:grid-cols-1  grid-cols-3 gap-2">
        <BriefCard2
          image={"/DinamikUcret.png"}
          title="Dinamik Ücretlendirme"
          description="Akademini oluştururken belirlediğin öğrenci sayısı kadar ücret ödeyerek esnek bir fiyat belirle."
        />
        <BriefCard2
          image={"/Roller.png"}
          title="Eğitmen ve öğrenciler için özel roller"
          description="Eğitmen olduğun akademide sanal dersler oluştur, zamanlamalı dersler ile planlı aktivitelerde bulun.
Öğrenci olarak sınırsız akademiler arasından istediklerini seç ve başkalarıyla iletişime geç."
        />
        <BriefCard2
          image={"/EsnekYonetim.png"}
          title="Akademi kurucuları için esnek yönetim araçları"
          description="Sana sunulan akademine özel alanda kişilerin rollerini değiştirebilir , genel gönderiler paylaşarak tüm öğrencilerin anında duyurulara erişmesini sağlayabilir, canlı dersler oluşturabilir ve sohbet edebilirsin."
        />
      </div>
    </section>
  );
};

export default BriefSection2;
