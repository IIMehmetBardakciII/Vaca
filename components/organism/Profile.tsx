"use client";

import { CircleUserRound, LogIn, Settings, UserCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { ModeToggle } from "./ThemeModeToggle";

const Profile = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  return (
    <div>
      {/* Avatar */}

      <div>
        <CircleUserRound
          size={32}
          className="cursor-pointer"
          onClick={() => setOpen((current) => !current)}
        />
      </div>
      {/* Content */}
      {open && (
        <div className="absolute right-2 flex flex-col  mt-2 h-fit w-fit px-4 py-2 border rounded ">
          <Link href="#" className="hover:underline flex gap-1 items-center">
            <span>
              <CircleUserRound size={16} />
            </span>
            Profilim
          </Link>
          <Separator className="mb-2" />
          <Link href="#" className="hover:underline flex gap-1 items-center">
            <span>
              <Settings size={16} />
            </span>
            Ayarlar
          </Link>
          <Separator className="mb-2" />
          <p className="flex gap-1 items-center hover:underline cursor-pointer">
            <ModeToggle />
          </p>
          <Separator className="mb-2" />
          {hasProfile && (
            <div>
              <Link
                href="#"
                className="hover:underline flex gap-1 items-center"
              >
                <span>
                  <LogIn size={16} />
                </span>
                Giriş Yap
              </Link>
              <Separator className="mb-2" />

              <Link
                href="#"
                className="hover:underline flex gap-1 items-center"
              >
                <span>
                  <UserCheck size={16} />
                </span>
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
