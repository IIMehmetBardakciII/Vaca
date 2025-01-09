import BriefSection1 from "@/components/organism/Homepage/BriefSection1";
import BriefSection2 from "@/components/organism/Homepage/BriefSection2";
import HeroSection from "@/components/organism/Homepage/HeroSection";
import LastSection from "@/components/organism/Homepage/LastSection";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <HeroSection />
      <BriefSection1 />
      <BriefSection2 />
      <LastSection />
    </main>
  );
}
