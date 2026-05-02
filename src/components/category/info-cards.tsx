import { formatManWon } from "@/lib/utils";
import type { Category } from "@/types";

interface InfoCardsProps {
  category: Category;
}

export function InfoCards({ category }: InfoCardsProps) {
  if (!category.eventDate) return null;

  const paidCount = category.payments.filter((p) => p.done).length;
  const totalCount = category.payments.length;

  return (
    <div className="px-5 pb-4 grid grid-cols-2 gap-2">
      <div className="card-soft">
        <div className="text-[11px] text-green-700">일정</div>
        <div className="text-sm font-bold mt-1">
          {category.eventDate.slice(5).replace("-", ".")}
        </div>
        <div className="text-[11px] text-ink-500 mt-0.5">
          {category.eventTime || "시간 미정"}
        </div>
      </div>
      <div className="card-soft">
        <div className="text-[11px] text-green-700">총 금액</div>
        <div className="text-sm font-bold mt-1">
          {category.total > 0 ? `${formatManWon(category.total)}만` : "미정"}
        </div>
        <div className="text-[11px] text-ink-500 mt-0.5">
          {totalCount > 0 ? `${paidCount}/${totalCount} 납부` : "-"}
        </div>
      </div>
    </div>
  );
}
