import VirtualClassCard from "@/components/organism/VirtualClassCard";
import { getVirtualClasses } from "@/lib/actions/getVirtualClasses";

const VirtualClassesPage = async ({ params }: { params: { id: string } }) => {
  const getWholeVirtualClass = await getVirtualClasses(params.id);

  return (
    <main className="grid w-full grid-cols-1 sm:grid-cols-4 sm:gap-2 gap-1">
      {getWholeVirtualClass.map((virtualClassObject: any) => (
        <VirtualClassCard
          key={virtualClassObject.id}
          academyId={params.id}
          callId={virtualClassObject.id}
          description={virtualClassObject.description}
          time={virtualClassObject.startsAt}
        />
      ))}
      {getWholeVirtualClass.length == 0 && (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl w-screen flex items-center justify-center">
          Şu anda aktif ders bulunmamaktadır.
        </h1>
      )}
    </main>
  );
};

export default VirtualClassesPage;
