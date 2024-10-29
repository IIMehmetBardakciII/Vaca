import Link from "next/link";

const VirtualAcademyPage = () => {
  return (
    <div>
      <ul className="flex flex-col w-[300px] p-4 gap-2  ">
        <li className="hover:bg-secondary-foreground hover:text-primary-foreground p-4 bg-secondary">
          <Link href="/create-academy" className="font-bold">
            Sanal Akademini Oluştur
            <span className="block text-xs font-light">
              Sanal Akademini oluştur ve öğrencilerinle hızlıca iletişime geç.
            </span>
          </Link>
        </li>
        <li className="hover:bg-secondary-foreground hover:text-primary-foreground p-4 bg-secondary">
          <Link href="/find-academy" className="font-bold">
            Sanal Akademini Bul
            <span className="block text-xs font-light">
              Sana oluşturulan Akademiler ile eşsiz yeteneklere sahip ol ,
              topluluklara katılarak kendini geliştir.
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default VirtualAcademyPage;
