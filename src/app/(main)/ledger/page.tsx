"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";
import { PageHeaderWithMenu } from "@/components/layout/page-header-with-menu";
import { LedgerSubNav } from "@/components/ledger/ledger-sub-nav";
import { LedgerAddModal } from "@/components/modals/ledger-add-modal";
import { useLedger, OWNER_COLORS, OWNER_SHORT } from "@/hooks/use-ledger";
import { getLedgerExpenseByOwner, getLedgerMonthSummary, getMonthKey } from "@/lib/ledger-utils";
import type { LedgerOwner } from "@/hooks/use-ledger";

export default function LedgerHomePage() {
  const { entries, addEntry } = useLedger();
  const [showAdd, setShowAdd] = useState(false);

  // 이번 달 필터
  const now = new Date();
  const ym = getMonthKey(now);
  const { entries: thisMonth, income: totalIncome, expense: totalExpense, balance } = getLedgerMonthSummary(entries, ym);

  // owner별 지출
  const byOwner = (owner: LedgerOwner) => getLedgerExpenseByOwner(thisMonth, owner);

  const groomExp = byOwner("groom");
  const brideExp = byOwner("bride");
  const sharedExp = byOwner("shared");
  const totalExp = groomExp + brideExp + sharedExp || 1;

  const recentExpenses = entries.filter((e) => e.type === "expense").slice(0, 5);

  return (
    <>
      <PageHeaderWithMenu title="가계부" />
      <LedgerSubNav />

      <div className="pb-24">
        {/* 이번 달 잔액 */}
        <div className="px-5 pt-6 pb-4 text-center">
          <div className="text-[11px] text-ink-500 mb-1">{now.getMonth() + 1}월 잔액</div>
          <div className="font-serif text-5xl font-bold tracking-tight text-green-700">
            {(balance / 10000).toLocaleString(undefined, { maximumFractionDigits: 1 })}
            <span className="text-lg text-ink-500 ml-1">만원</span>
          </div>
          <div className="flex justify-center gap-4 mt-3 text-[12px]">
            <span className="text-green-600">수입 +{(totalIncome / 10000).toFixed(0)}만</span>
            <span className="text-ink-400">지출 -{(totalExpense / 10000).toFixed(0)}만</span>
          </div>
        </div>

        {/* Owner 3분할 카드 */}
        <div className="px-4 grid grid-cols-3 gap-2 mb-5">
          {(["groom", "bride", "shared"] as LedgerOwner[]).map((owner) => {
            const exp = byOwner(owner);
            const c = OWNER_COLORS[owner];
            return (
              <div key={owner} className={`rounded-xl p-3 border ${c.border} ${c.bg}`}>
                <div className="flex items-center gap-1 mb-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                  <span className="text-[10px] font-medium text-ink-500">{OWNER_SHORT[owner]}</span>
                </div>
                <div className="text-[10px] text-ink-400">지출</div>
                <div className={`font-serif font-bold ${c.text} mt-0.5`}>
                  <span className="text-xl">{Math.round(exp / 10000).toLocaleString()}</span>
                  <span className="text-[11px] ml-0.5">만</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 지출 분포 bar */}
        {totalExp > 1 && (
          <div className="px-5 pb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold">이번달 지출 분포</span>
              <span className="text-[11px] text-ink-500">{Math.round(totalExp / 10000)}만</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden flex bg-ink-100">
              {groomExp > 0 && <div className="bg-blue-500" style={{ width: `${(groomExp / totalExp) * 100}%` }} />}
              {brideExp > 0 && <div className="bg-rose-500" style={{ width: `${(brideExp / totalExp) * 100}%` }} />}
              {sharedExp > 0 && <div className="bg-green-500" style={{ width: `${(sharedExp / totalExp) * 100}%` }} />}
            </div>
            <div className="flex gap-4 mt-2 text-[10px] text-ink-500">
              <span>신랑 {Math.round((groomExp / totalExp) * 100)}%</span>
              <span>신부 {Math.round((brideExp / totalExp) * 100)}%</span>
              <span>공동 {Math.round((sharedExp / totalExp) * 100)}%</span>
            </div>
          </div>
        )}

        {/* 최근 거래 */}
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[14px] font-bold">최근 거래</h3>
            <a href="/ledger/transactions" className="text-[11px] text-green-600 font-medium">전체보기 →</a>
          </div>
          {recentExpenses.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-ink-400">거래가 없어요</div>
          ) : (
            <div className="card p-0">
              {recentExpenses.map((e, i) => {
                const c = OWNER_COLORS[e.owner];
                return (
                  <div key={e.id} className={`px-4 py-3 flex items-center gap-3 ${
                    i < recentExpenses.length - 1 ? "border-b border-ink-100" : ""
                  }`}>
                    <span className={`w-1.5 h-10 rounded-full ${c.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold truncate">{e.title}</div>
                      <div className="text-[11px] text-ink-500 mt-0.5">
                        {e.date.slice(5).replace("-", ".")} · {OWNER_SHORT[e.owner]}
                      </div>
                    </div>
                    <div className="text-[13px] font-bold text-ink-700">
                      -{e.amount.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 다가오는 결제 */}
        {entries.some((e) => e.isPlanned) && (
          <div className="px-5 pb-4">
            <h3 className="text-[14px] font-bold mb-2.5">다가오는 결제</h3>
            <div className="card p-0">
              {entries.filter((e) => e.isPlanned).slice(0, 3).map((e) => (
                <div key={e.id} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-12 text-center text-[10px] text-ink-500">
                    <div>{e.date.slice(5, 7)}/{e.date.slice(8)}</div>
                  </div>
                  <div className="flex-1 text-[13px] font-medium">{e.title}</div>
                  <div className="text-[13px] font-bold text-green-700">
                    {(e.amount / 10000).toFixed(0)}만
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed right-5 bottom-[90px] w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg border-none cursor-pointer z-40"
      >
        <PlusIcon width={22} height={22} />
      </button>

      {showAdd && (
        <LedgerAddModal onSave={addEntry} onClose={() => setShowAdd(false)} />
      )}
    </>
  );
}
