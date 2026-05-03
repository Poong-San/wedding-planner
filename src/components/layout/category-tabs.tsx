"use client";

import { useRouter } from "next/navigation";
import { MAIN_TABS } from "@/lib/constants";

export function CategoryTabs() {
  const router = useRouter();

  return (
    <div className="flex gap-1 px-4 pb-3.5 overflow-x-auto scrollbar-hide flex-shrink-0">
      {MAIN_TABS.map((tab) => (
        <button
          key={tab.type}
          onClick={() => router.push(`/category/${tab.type}`)}
          className="flex-shrink-0 px-3.5 py-2 rounded-full text-[13px] font-medium whitespace-nowrap border cursor-pointer font-sans bg-white text-ink-700 border-ink-200"
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}
