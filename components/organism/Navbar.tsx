import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import Profile from "./Profile";
import { getCookies } from "@/lib/actions/Cookies";
import LogOutButton from "../utilities/LogOutButton";

const Navbar = async () => {
  const { verifiedToken, success } = await getCookies();

  return (
    <header className="flex  items-center justify-between ">
      {/* logo */}
      <div className="cursor-pointer">
        <Link href={"/"}>
          <h2 className="scroll-m-20   text-3xl font-semibold tracking-tight first:mt-0">
            Vaca
          </h2>
        </Link>
      </div>

      {/* Kayıt OL buton */}
      {/* Giriş Yap buton */}
      {/* Sanal akademi dropdown -> Akademi ara , Akademi Oluştur */}
      {/* Profil Avatar */}
      <div className="flex gap-2 items-center">
        {/* SearchBar */}
        <div className="sm:relative hidden">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
        {/* DropDown Menu */}
        <div className="sm:block hidden">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Sanal Akademi</NavigationMenuTrigger>
                <NavigationMenuContent className="">
                  <ul className="flex flex-col w-[300px] p-4 gap-2 ">
                    <li className="hover:bg-secondary">
                      <Link href="/create-academy" className="font-bold">
                        Sanal Akademini Oluştur
                        <span className="block text-xs font-light">
                          Sanal Akademini oluştur ve öğrencilerinle hızlıca
                          iletişime geç.
                        </span>
                      </Link>
                    </li>
                    <li className="hover:bg-secondary">
                      <Link href="/find-academy" className="font-bold">
                        Sanal Akademini Bul
                        <span className="block text-xs font-light">
                          Sana oluşturulan Akademiler ile eşsiz yeteneklere
                          sahip ol , topluluklara katılarak kendini geliştir.
                        </span>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {success ? (
          <LogOutButton />
        ) : (
          <>
            <Button asChild className="sm:block hidden">
              <Link href="/signup">Kayıt Ol</Link>
            </Button>
            <Button variant={"outline"} asChild className="sm:block hidden">
              <Link href="/signin">Giriş Yap</Link>
            </Button>
          </>
        )}
        {/* Profile Avatar  */}
        <div>
          <Profile
            profilePicture={
              typeof verifiedToken?.profilePicture === "string"
                ? verifiedToken.profilePicture
                : undefined
            }
            hasProfile={success}
            email={
              typeof verifiedToken?.email === "string"
                ? verifiedToken.email
                : undefined
            }
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
