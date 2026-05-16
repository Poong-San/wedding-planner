"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";
import { PageHeaderWithMenu } from "@/components/layout/page-header-with-menu";
import { LedgerSubNav } from "@/components/ledger/ledger-sub-nav";
import { LedgerRecurringModal } from "@/components/modals/ledger-recurring-modal";
import { useLedger, OWNER_COLORS } from "@/hooks/use-ledger";
import { useCouple } from "@/hooks/use-couple";
import { getOwnerShortLabels } from "@/lib/couple-labels";

export default function LedgerRecurringPage() {
  const { entries, addEntry, deleteEntry } = useLedger();
  const { couple } = useCouple();
  const [showAdd, setShowAdd] = useState(false);
  const ownerLabels = getOwnerShortLabels(couple);

  const recurring = entries.filter((e) => e.isRecurring);
  const incomes = recurring.filter((e) => e.type === "income");
  const expenses = recurring.filter((e) => e.type === "expense");

  const totalIncome = incomes.reduce((s, e) => s + e.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const savings = totalIncome - totalExpense;

  return (
    <>
      <PageHeaderWithMenu title="고정 수입/지출" />
      <LedgerSubNav />

      <div className="pb-24">
        {/* 요약 */}
        <div className="px-5 pt-6 pb-4 text-center">
          <div className="text-[11px] text-ink-500 mb-1">매달 고정 후 가용 저축</div>
          <div className="font-serif text-5xl font-bold tracking-tight text-green-700">
            {(savings / 10000).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            <span className="text-lg text-ink-500 ml-1">만원</span>
          </div>
        </div>

        <div className="px-5 pb-4 grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-lg bg-green-50 border border-green-200">
            <div className="text-[10px] text-ink-500">수입</div>
            <div className="text-[14px] font-bold text-green-600 font-serif">+{Math.round(totalIncome / 10000)}만</div>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
            <div className="text-[10px] text-ink-500">고정지출</div>
            <div className="text-[14px] font-bold text-rose-500 font-serif">{Math.round(totalExpense / 10000)}만</div>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-[10px] text-ink-500">저축</div>
            <div className="text-[14px] font-bold text-blue-600 font-serif">{Math.round(savings / 10000)}만</div>
          </div>
        </div>

        {/* 매달 수입 */}
        <RecurringSection title="매달 수입" items={incomes} ownerLabels={ownerLabels} onDelete={deleteEntry} totalColor="text-green-600" />

        {/* 매달 고정지출 */}
        <RecurringSection title="매달 고정지출" items={expenses} ownerLabels={ownerLabels} onDelete={deleteEntry} totalColor="text-rose-500" />
      </div>

      <button
        onClick={() => setShowAdd(true)}
        className="fixed right-5 bottom-[90px] w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg border-none cursor-pointer z-40"
      >
        <PlusIcon width={22} height={22} />
      </button>

      {showAdd && <LedgerRecurringModal onSave={addEntry} onClose={() => setShowAdd(false)} />}
    </>
  );
}

function RecurringSection({ title, items, ownerLabels, onDelete, totalColor }: {
  title: string;
  items: import("@/hooks/use-ledger").LedgerEntry[];
  ownerLabels: Record<import("@/hooks/use-ledger").LedgerOwner, string>;
  onDelete: (id: string) => void;
  totalColor: string;
}) {
  if (items.length === 0) return null;
  const total = items.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[13px] font-bold">{title}</h3>
        <span className={`text-[12px] font-bold ${totalColor}`}>{Math.round(total / 10000)}만</span>
      </div>
      <div className="card p-0">
        {items.map((e, i) => {
          const c = OWNER_COLORS[e.owner];
          return (
            <div key={e.id} className={`px-4 py-3 flex items-center gap-3 ${
              i < items.length - 1 ? "border-b border-ink-100" : ""
            }`}>
              <span className={`w-1.5 h-10 rounded-full ${c.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold truncate">{e.title}</div>
                <div className="text-[10px] text-ink-400">
                  매월 {e.recurringDay || "-"}일 · {ownerLabels[e.owner]}
                </div>
              </div>
              <div className={`text-[13px] font-bold ${e.type === "income" ? "text-green-600" : "text-ink-700"}`}>
                {e.type === "income" ? "+" : "-"}{e.amount.toLocaleString()}
              </div>
              <button
                onClick={() => { if (confirm("삭제?")) onDelete(e.id); }}
                className="text-ink-400 text-xs bg-transparent border-none cursor-pointer p-1"
              >✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
