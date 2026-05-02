import { ProgressBar } from "@/components/ui/progress-bar";
import { getCategorySpent, formatManWon } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryBarsProps {
  categories: Category[];
}

export function CategoryBars({ categories }: CategoryBarsProps) {
  const filtered = categories.filter((c) => c.total > 0);

  return (
    <div className="px-5 pb-[18px]">
      <div className="text-[11px] text-ink-500 uppercase tracking-wider font-medium mb-3">
        카테고리별 지출
      </div>
      {filtered.map((c, i) => {
        const spent = getCategorySpent(c);
        const ratio = c.total > 0 ? (spent / c.total) * 100 : 0;
        return (
          <div key={i} className="mb-3.5">
            <div className="flex justify-between mb-1.5 text-xs">
              <span className="font-medium">{c.name}</span>
              <span className="text-ink-500">
                <span className="text-ink-900 font-semibold">{formatManWon(spent)}만</span>
                <span className="mx-1">/</span>
                {formatManWon(c.total)}만
              </span>
            </div>
            <ProgressBar percent={ratio} height={5} />
          </div>
        );
      })}
    </div>
  );
}
