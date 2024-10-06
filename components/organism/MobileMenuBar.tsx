"use client";
import { Menu } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "./ThemeModeToggle";

const MobileMenuBar = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="relative">
      <Menu onClick={() => setOpen((currentState) => !currentState)} />
      {/* Content */}
      {open && (
        <div className="absolute">
          <ul>
            <li>
              <ModeToggle />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobileMenuBar;
