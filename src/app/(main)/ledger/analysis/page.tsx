"use client";

import { useState } from "react";
import { PageHeaderWithMenu } from "@/components/layout/page-header-with-menu";
import { LedgerSubNav } from "@/components/ledger/ledger-sub-nav";
import { useLedger } from "@/hooks/use-ledger";
import { useCouple } from "@/hooks/use-couple";
import { getOwnerShortLabels } from "@/lib/couple-labels";

type Period = "week" | "month" | "year";

const CATEGORY_COLORS = [
  "bg-green-500",
  "bg-rose-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-pink-500",
];

export default function LedgerAnalysisPage() {
  const { entries } = useLedger();
  const { couple } = useCouple();
  const [period, setPeriod] = useState<Period>("month");
  const ownerLabels = getOwnerShortLabels(couple);

  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisMonth = entries.filter((e) => e.date.startsWith(ym));
  const expenses = thisMonth.filter((e) => e.type === "expense");
  const totalExp = expenses.reduce((s, e) => s + e.amount, 0);

  // 월별 지출 (최근 5개월)
  const monthlyExp: { month: string; amount: number }[] = [];
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const amt = entries.filter((e) => e.date.startsWith(key) && e.type === "expense").reduce((s, e) => s + e.amount, 0);
    monthlyExp.push({ month: `${d.getMonth() + 1}월`, amount: amt });
  }
  const maxMonthly = Math.max(...monthlyExp.map((m) => m.amount), 1);

  // 카테고리별 지출
  const catMap: Record<string, number> = {};
  expenses.forEach((e) => {
    const k = e.categoryType || "기타";
    catMap[k] = (catMap[k] || 0) + e.amount;
  });
  const catData = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // 전월 대비
  const lastMonthKey = (() => {
    const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  })();
  const lastMonthExp = entries.filter((e) => e.date.startsWith(lastMonthKey) && e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const diff = totalExp - lastMonthExp;
  const diffPct = lastMonthExp > 0 ? Math.round((diff / lastMonthExp) * 100) : 0;

  // Owner 비교
  const byOwner = {
    groom: expenses.filter((e) => e.owner === "groom").reduce((s, e) => s + e.amount, 0),
    bride: expenses.filter((e) => e.owner === "bride").reduce((s, e) => s + e.amount, 0),
    shared: expenses.filter((e) => e.owner === "shared").reduce((s, e) => s + e.amount, 0),
  };

  return (
    <>
      <PageHeaderWithMenu title="가계부 분석" />
      <LedgerSubNav />

      <div className="pb-24">
        {/* 기간 토글 */}
        <div className="px-5 pt-4 pb-3">
          <div className="grid grid-cols-3 gap-1 p-1 bg-ink-100 rounded-lg">
            {(["week", "month", "year"] as Period[]).map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`py-2 text-[12px] font-medium rounded-md cursor-pointer border-none font-sans ${
                  period === p ? "bg-white shadow-sm" : "bg-transparent text-ink-500"
                }`}>
                {p === "week" ? "주간" : p === "month" ? "월간" : "연간"}
              </button>
            ))}
          </div>
        </div>

        {/* 총 지출 */}
        <div className="px-5 py-4 border-b border-ink-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-ink-500">이번달 지출</span>
            <span className={`text-[11px] font-medium ${diff > 0 ? "text-rose-500" : "text-green-600"}`}>
              전월 대비 {diff > 0 ? "+" : ""}{diffPct}%
            </span>
          </div>
          <div className="font-serif text-3xl font-bold">
            {totalExp.toLocaleString()}
            <span className="text-sm text-ink-500 ml-1">원</span>
          </div>
          <div className="text-[10px] text-ink-400 mt-1">
            {now.getMonth() + 1}월 · 일평균 {Math.round(totalExp / now.getDate()).toLocaleString()}원
          </div>
        </div>

        {/* 월별 지출 추이 bar */}
        <div className="px-5 py-5 border-b border-ink-100">
          <h3 className="text-[13px] font-bold mb-3">월별 지출 추이</h3>
          <div className="flex items-end justify-between gap-2 h-28">
            {monthlyExp.map((m, i) => {
              const h = (m.amount / maxMonthly) * 100;
              const isCurrent = i === monthlyExp.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center justify-end" style={{ height: "90px" }}>
                    <div
                      className={`w-full rounded-t-md ${isCurrent ? "bg-green-600" : "bg-green-300"}`}
                      style={{ height: `${h}%`, minHeight: m.amount > 0 ? "4px" : "0" }}
                    />
                  </div>
                  <div className="text-[10px] text-ink-500">{m.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 카테고리별 지출 */}
        <div className="px-5 py-5 border-b border-ink-100">
          <h3 className="text-[13px] font-bold mb-3">카테고리별 지출</h3>
          {catData.length === 0 ? (
            <div className="py-6 text-center text-[13px] text-ink-400">데이터 없음</div>
          ) : (
            <div className="flex flex-col gap-2">
              {catData.map(([k, v], i) => {
                const pct = Math.round((v / totalExp) * 100);
                return (
                  <div key={k}>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[i % 8]}`} />
                        <span className="font-medium text-ink-700">{k}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-ink-500">{pct}%</span>
                        <span className="font-bold">{v.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                      <div className={`h-full ${CATEGORY_COLORS[i % 8]}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Owner 비교 */}
        <div className="px-5 py-5">
          <h3 className="text-[13px] font-bold mb-3">{ownerLabels.groom}/{ownerLabels.bride}/{ownerLabels.shared} 비교</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <div className="text-[10px] text-ink-500 mb-1">{ownerLabels.groom}</div>
              <div className="font-serif text-lg font-bold text-blue-600">
                {Math.round(byOwner.groom / 10000)}<span className="text-[10px] ml-0.5">만</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
              <div className="text-[10px] text-ink-500 mb-1">{ownerLabels.bride}</div>
              <div className="font-serif text-lg font-bold text-rose-600">
                {Math.round(byOwner.bride / 10000)}<span className="text-[10px] ml-0.5">만</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-center">
              <div className="text-[10px] text-ink-500 mb-1">공동</div>
              <div className="font-serif text-lg font-bold text-green-600">
                {Math.round(byOwner.shared / 10000)}<span className="text-[10px] ml-0.5">만</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
