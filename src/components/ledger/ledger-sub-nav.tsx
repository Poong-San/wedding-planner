"use client";

import { usePathname, useRouter } from "next/navigation";

const SUB_TABS = [
  { id: "home", path: "/ledger", label: "홈" },
  { id: "transactions", path: "/ledger/transactions", label: "내역" },
  { id: "calendar", path: "/ledger/calendar", label: "캘린더" },
  { id: "recurring", path: "/ledger/recurring", label: "고정" },
  { id: "planned", path: "/ledger/planned", label: "예정" },
  { id: "analysis", path: "/ledger/analysis", label: "분석" },
];

export function LedgerSubNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex gap-1 px-2 border-b border-ink-200 overflow-x-auto scrollbar-hide">
      {SUB_TABS.map((tab) => {
        const isActive =
          tab.path === "/ledger"
            ? pathname === "/ledger"
            : pathname.startsWith(tab.path);

        return (
          <button
            key={tab.id}
            onClick={() => router.push(tab.path)}
            className={`flex-shrink-0 px-3.5 py-2.5 text-[13px] font-medium whitespace-nowrap border-none cursor-pointer font-sans bg-transparent ${
              isActive ? "text-ink-900" : "text-ink-400"
            }`}
            style={isActive ? { borderBottom: "2px solid #22c55e" } : undefined}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
