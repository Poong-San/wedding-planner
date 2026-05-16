"use client";

import { getGuestSideLabels } from "@/lib/couple-labels";
import { useCouple } from "@/hooks/use-couple";

interface GuestTabsProps {
  tab: string;
  onTabChange: (tab: string) => void;
  totalCount: number;
  groomCount: number;
  brideCount: number;
}

export function GuestTabs({ tab, onTabChange, totalCount, groomCount, brideCount }: GuestTabsProps) {
  const { couple } = useCouple();
  const sideLabels = getGuestSideLabels(couple);
  const tabs = [
    { k: "all", l: `전체 (${totalCount})` },
    { k: "groom", l: `${sideLabels.groom} (${groomCount})` },
    { k: "bride", l: `${sideLabels.bride} (${brideCount})` },
  ];

  return (
    <div className="flex border-b border-ink-200 mx-5">
      {tabs.map((t) => (
        <button
          key={t.k}
          onClick={() => onTabChange(t.k)}
          className={`flex-1 py-2.5 text-xs font-sans bg-transparent border-none cursor-pointer -mb-px ${
            tab === t.k
              ? "font-bold text-green-700 border-b-2 border-green-500"
              : "font-medium text-ink-500 border-b-2 border-transparent"
          }`}
        >
          {t.l}
        </button>
      ))}
    </div>
  );
}
