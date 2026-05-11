"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";
import { PageHeaderWithMenu } from "@/components/layout/page-header-with-menu";
import { LedgerSubNav } from "@/components/ledger/ledger-sub-nav";
import { LedgerPlannedModal } from "@/components/modals/ledger-planned-modal";
import { useLedger, OWNER_COLORS, OWNER_SHORT } from "@/hooks/use-ledger";
import { daysUntil } from "@/lib/utils";

export default function LedgerPlannedPage() {
  const { entries, addEntry, deleteEntry } = useLedger();
  const [showAdd, setShowAdd] = useState(false);

  const planned = entries.filter((e) => e.isPlanned && e.type === "expense");
  const total = planned.reduce((s, e) => s + e.amount, 0);

  // 날짜순 정렬
  const sorted = [...planned].sort((a, b) => a.date.localeCompare(b.date));

  // 타임라인 분류
  const groupByWindow = (e: any) => {
    const d = daysUntil(e.date);
    if (d <= 7) return "1주 이내";
    if (d <= 14) return "2주 이내";
    if (d <= 30) return "1달 이내";
    if (d <= 60) return "2달 이내";
    return "그 이후";
  };

  const grouped: Record<string, typeof planned> = {};
  sorted.forEach((e) => {
    const w = groupByWindow(e);
    if (!grouped[w]) grouped[w] = [];
    grouped[w].push(e);
  });

  const order = ["1주 이내", "2주 이내", "1달 이내", "2달 이내", "그 이후"];

  return (
    <>
      <PageHeaderWithMenu title="예정 지출" />
      <LedgerSubNav />

      <div className="pb-24">
        <div className="px-5 pt-6 pb-4 text-center">
          <div className="text-[11px] text-ink-500 mb-1">앞으로 나갈 돈 ({planned.length}건)</div>
          <div className="font-serif text-5xl font-bold tracking-tight text-green-700">
            {(total / 10000).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            <span className="text-lg text-ink-500 ml-1">만원</span>
          </div>
        </div>

        {planned.length === 0 ? (
          <div className="py-12 text-center text-[13px] text-ink-400">예정 지출이 없어요</div>
        ) : (
          order.filter((w) => grouped[w]).map((w) => (
            <div key={w} className="px-5 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-3 bg-green-500 rounded-full" />
                <h3 className="text-[12px] font-bold text-ink-700">{w} · {grouped[w].length}건</h3>
              </div>
              <div className="card p-0">
                {grouped[w].map((e, i) => {
                  const c = OWNER_COLORS[e.owner];
                  const days = daysUntil(e.date);
                  return (
                    <div key={e.id} className={`px-4 py-3.5 flex items-center gap-3 ${
                      i < grouped[w].length - 1 ? "border-b border-ink-100" : ""
                    }`}>
                      <div className="w-11 flex flex-col items-center justify-center">
                        <div className="text-[9px] text-ink-500">D-{days}</div>
                        <div className="text-[11px] font-bold">{e.date.slice(5, 7)}/{e.date.slice(8)}</div>
                      </div>
                      <span className={`w-1 h-10 rounded-full ${c.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold truncate">{e.title}</div>
                        <div className="text-[10px] text-ink-400 mt-0.5">
                          {OWNER_SHORT[e.owner]} {e.memo && `· ${e.memo}`}
                        </div>
                      </div>
                      <div className="font-serif text-[15px] font-bold text-green-700">
                        {Math.round(e.amount / 10000)}만
                      </div>
                      <button
                        onClick={() => { if (confirm("삭제?")) deleteEntry(e.id); }}
                        className="text-ink-400 text-xs bg-transparent border-none cursor-pointer p-1"
                      >✕</button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => setShowAdd(true)}
        className="fixed right-5 bottom-[90px] w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg border-none cursor-pointer z-40"
      >
        <PlusIcon width={22} height={22} />
      </button>

      {showAdd && <LedgerPlannedModal onSave={addEntry} onClose={() => setShowAdd(false)} />}
    </>
  );
}
