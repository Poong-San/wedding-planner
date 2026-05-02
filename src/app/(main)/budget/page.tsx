"use client";

import { PlusIcon } from "@/components/ui/icons";
import { DonutChart } from "@/components/budget/donut-chart";
import { CategoryBars } from "@/components/budget/category-bars";
import { getCategorySpent, formatManWon } from "@/lib/utils";
import { useCategories } from "@/hooks/use-categories";
import { useBudget } from "@/hooks/use-budget";

export default function BudgetPage() {
  const { budget } = useBudget();
  const { categories } = useCategories();

  const total = budget.total;
  const cats = Object.values(categories);
  const used = cats.reduce((s, c) => s + getCategorySpent(c), 0);
  const pct = total > 0 ? (used / total) * 100 : 0;

  return (
    <>
      <div className="px-5 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold m-0">예산관리</h1>
        <button className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center border-none cursor-pointer">
          <PlusIcon width={18} height={18} />
        </button>
      </div>

      <div className="px-5 pb-[18px] text-center">
        <DonutChart percent={pct} used={used} total={total} />
        <div className="inline-flex gap-2.5 mt-3.5 px-3.5 py-2 bg-green-50 rounded-full text-xs">
          <span className="text-ink-500">남은 예산</span>
          <span className="font-bold text-green-700">{formatManWon(total - used)}만원</span>
        </div>
      </div>

      <CategoryBars categories={cats} />
    </>
  );
}
