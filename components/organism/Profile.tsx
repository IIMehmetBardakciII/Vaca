"use client";

import { CircleUserRound, LogIn, Settings, UserCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { ModeToggle } from "./ThemeModeToggle";
import Image from "next/image";
type ProfileProps = {
  profilePicture?: string;
  hasProfile?: boolean;
  email?: string;
};
const Profile = ({ profilePicture, hasProfile, email }: ProfileProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <div className="w-8 h-8 relative">
        {/* Avatar */}
        {profilePicture ? (
          <Image
            src={profilePicture}
            alt="profile"
            // width={32}
            // height={32}
            fill
            className=" rounded-full cursor-pointer border object-cover"
            onClick={() => setOpen((current) => !current)}
          />
        ) : (
          <div>
            <CircleUserRound
              size={32}
              className="cursor-pointer"
              onClick={() => setOpen((current) => !current)}
            />
          </div>
        )}
      </div>

      {/* Content */}
      {open && (
        <div className="absolute z-30 right-2 flex flex-col  mt-2 h-fit w-fit px-4 py-2 border rounded bg-secondary ">
          <Link
            href={`/${email}`}
            className="hover:underline flex gap-1 items-center"
          >
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
          <div
            className="flex gap-1 items-center hover:underline cursor-pointer "
            onClick={() => setOpen((currentState) => !currentState)}
          >
            <ModeToggle />
          </div>
          <Separator className="mb-2" />
          {!hasProfile && (
            <div>
              <Link
                href="/signin"
                className="hover:underline flex gap-1 items-center"
              >
                <span>
                  <LogIn size={16} />
                </span>
                Giriş Yap
              </Link>
              <Separator className="mb-2" />

              <Link
                href="/signup"
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
