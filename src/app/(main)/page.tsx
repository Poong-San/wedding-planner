"use client";

import { SearchIcon, BellIcon } from "@/components/ui/icons";
import { CategoryTabs } from "@/components/layout/category-tabs";
import { HeroSection } from "@/components/home/hero-section";
import { BudgetSummary } from "@/components/home/budget-summary";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { CategoryGrid } from "@/components/home/category-grid";
import { useCouple } from "@/hooks/use-couple";
import { useCategories } from "@/hooks/use-categories";
import { useEvents } from "@/hooks/use-events";
import { useBudget } from "@/hooks/use-budget";
import { getCategorySpent } from "@/lib/utils";

export default function HomePage() {
  const { couple, updateCouple, updateMessage } = useCouple();
  const { categories } = useCategories();
  const { events } = useEvents();
  const { budget } = useBudget();

  const cats = Object.values(categories);
  const used = cats.reduce((s, c) => s + getCategorySpent(c), 0);

  const upcoming = events
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

      <HeroSection couple={couple} onUpdateCouple={updateCouple} onUpdateMessage={updateMessage} />
      <BudgetSummary total={budget.total} used={used} />
      <UpcomingEvents events={upcoming} />
      <CategoryGrid categories={cats} />
    </>
  );
}
