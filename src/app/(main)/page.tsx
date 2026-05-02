"use client";

import { SearchIcon, BellIcon } from "@/components/ui/icons";
import { CategoryTabs } from "@/components/layout/category-tabs";
import { HeroSection } from "@/components/home/hero-section";
import { BudgetSummary } from "@/components/home/budget-summary";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { CategoryGrid } from "@/components/home/category-grid";
import { MOCK_COUPLE, MOCK_CATEGORIES, MOCK_EVENTS, MOCK_BUDGET } from "@/lib/mock-data";
import { getCategorySpent } from "@/lib/utils";

export default function HomePage() {
  const couple = MOCK_COUPLE;
  const categories = Object.values(MOCK_CATEGORIES);
  const budget = MOCK_BUDGET;
  const used = categories.reduce((s, c) => s + getCategorySpent(c), 0);

  const upcoming = MOCK_EVENTS
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <>
      <div className="px-5 py-3 flex items-center justify-between flex-shrink-0">
        <h1 className="text-lg font-bold m-0 flex items-center gap-1.5">
          <span className="text-green-600">♡</span>
          우리의 결혼
        </h1>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center border-none cursor-pointer">
            <SearchIcon width={18} height={18} />
          </button>
          <button className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center border-none cursor-pointer">
            <BellIcon width={18} height={18} />
          </button>
        </div>
      </div>

      <CategoryTabs />

      <HeroSection couple={couple} />
      <BudgetSummary total={budget.total} used={used} />
      <UpcomingEvents events={upcoming} />
      <CategoryGrid categories={categories} />
    </>
  );
}
