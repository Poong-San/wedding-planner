"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";
import { PageHeaderWithMenu } from "@/components/layout/page-header-with-menu";
import { LedgerAddModal } from "@/components/modals/ledger-add-modal";
import { useLedger } from "@/hooks/use-ledger";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { CategoryType } from "@/types";

export default function LedgerPage() {
  const { entries, addEntry, deleteEntry } = useLedger();
  const [showAdd, setShowAdd] = useState(false);

  const totalSpent = entries.reduce((s, e) => s + e.amount, 0);

  // 날짜별 그룹
  const grouped: Record<string, typeof entries> = {};
  entries.forEach((e) => {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  });
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <PageHeaderWithMenu
        title="가계부"
        right={
          <button
            onClick={() => setShowAdd(true)}
            className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center border-none cursor-pointer"
          >
            <PlusIcon width={18} height={18} />
          </button>
        }
      />

      <div className="px-5 pb-4">
        <div className="card-soft">
          <div className="text-[11px] text-ink-500 mb-1">총 지출</div>
          <div className="text-2xl font-bold text-green-700">
            {Math.round(totalSpent / 10000).toLocaleString()}<span className="text-base ml-1">만원</span>
          </div>
          <div className="text-[11px] text-ink-500 mt-1">{entries.length}건</div>
        </div>
      </div>

      <div className="px-5">
        {entries.length === 0 ? (
          <div className="py-12 text-center text-[13px] text-ink-400">
            지출 내역이 없어요. + 버튼으로 기록해보세요.
          </div>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="mb-4">
              <div className="text-[11px] text-ink-500 font-medium mb-2">
                {date.replace(/-/g, ".")}
              </div>
              <div className="card p-0">
                {grouped[date].map((e, i) => (
                  <div
                    key={e.id}
                    className={`px-4 py-3 flex items-center gap-3 ${
                      i < grouped[date].length - 1 ? "border-b border-ink-100" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold truncate">{e.title}</div>
                      <div className="text-[11px] text-ink-500 mt-0.5">
                        {e.categoryType ? CATEGORY_LABELS[e.categoryType as CategoryType] || "" : "기타"}
                        {e.memo && ` · ${e.memo}`}
                      </div>
                    </div>
                    <div className="text-[13px] font-bold text-green-700 flex-shrink-0">
                      {e.amount.toLocaleString()}원
                    </div>
                    <button
                      onClick={() => deleteEntry(e.id)}
                      className="text-ink-400 text-xs bg-transparent border-none cursor-pointer p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {showAdd && (
        <LedgerAddModal
          onSave={(entry) => addEntry(entry)}
          onClose={() => setShowAdd(false)}
        />
      )}
    </>
  );
}
