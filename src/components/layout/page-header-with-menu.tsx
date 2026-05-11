"use client";

import { useState } from "react";
import { MenuIcon } from "@/components/ui/icons";
import { MenuDrawer } from "./menu-drawer";

interface PageHeaderWithMenuProps {
  title: string;
  right?: React.ReactNode;
}

export function PageHeaderWithMenu({ title, right }: PageHeaderWithMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="px-5 py-3 flex items-center justify-between flex-shrink-0">
        <h1 className="text-lg font-bold m-0">{title}</h1>
        <div className="flex gap-2 items-center">
          {right}
          <button
            onClick={() => setMenuOpen(true)}
            className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center border-none cursor-pointer"
          >
            <MenuIcon width={18} height={18} />
          </button>
        </div>
      </div>
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
