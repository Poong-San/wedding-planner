"use client";

import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatManWon } from "@/lib/utils";

interface BudgetSummaryProps {
  total: number;
  used: number;
}

export function BudgetSummary({ total, used }: BudgetSummaryProps) {
  const router = useRouter();
  const pct = total > 0 ? Math.round((used / total) * 100) : 0;

  return (
    <div className="px-4 pb-4">
      <div className="card-soft cursor-pointer" onClick={() => router.push("/budget")}>
        <div className="flex justify-between mb-2.5">
          <span className="text-[13px] font-semibold">예산 현황</span>
          <span className="text-[11px] text-green-700">{pct}% 사용</span>
        </div>
        <ProgressBar percent={pct} className="mb-2.5" />
        <div className="flex justify-between text-xs">
          <span className="text-ink-500">사용 {formatManWon(used)}만원</span>
          <span className="font-semibold">남은 {formatManWon(total - used)}만원</span>
        </div>
      </div>
    </div>
  );
}
