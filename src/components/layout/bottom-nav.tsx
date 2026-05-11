"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon, CalendarIcon, ClipboardIcon,
  WalletIcon, CheckIcon,
} from "@/components/ui/icons";

const NAV_ITEMS = [
  { id: "home", path: "/", label: "홈", Icon: HomeIcon },
  { id: "calendar", path: "/calendar", label: "캘린더", Icon: CalendarIcon },
  { id: "reservations", path: "/reservations", label: "예약현황", Icon: ClipboardIcon },
  { id: "ledger", path: "/ledger", label: "가계부", Icon: WalletIcon },
  { id: "checklist", path: "/checklist", label: "체크리스트", Icon: CheckIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[72px] bg-white border-t border-ink-200 grid grid-cols-5 items-center pb-1 z-50">
      {NAV_ITEMS.map((item) => {
        const isActive = item.path === "/"
          ? pathname === "/"
          : pathname.startsWith(item.path);

        return (
          <button
            key={item.id}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center justify-center gap-1 h-full bg-transparent border-none cursor-pointer font-sans text-[10px] ${
              isActive ? "text-green-600" : "text-ink-500"
            }`}
          >
            <item.Icon width={22} height={22} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
